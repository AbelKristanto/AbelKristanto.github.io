/**
 * Post Editor
 * -----------
 * A no-code authoring page for the site owner. It builds a Jekyll post file
 * from a form and commits it to the repository through the GitHub Contents API.
 *
 * Design notes:
 *   - The draft (everything except the token) is mirrored to localStorage on
 *     every keystroke, so a refresh or a closed tab never loses writing.
 *   - The token lives in sessionStorage by default: it disappears when the tab
 *     closes. "Remember" moves it to localStorage, which is the user's call.
 *   - Preview renders a deliberately small Markdown subset, exactly what the
 *     toolbar can insert. Input is HTML-escaped before any markup is applied,
 *     so a stray angle bracket in the draft cannot inject anything here.
 *   - Publishing always has a manual fallback (download / copy), so the page is
 *     still useful without a token.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-editor]');
  if (!root) {
    return;
  }

  var DRAFT_KEY = 'post-editor-draft';
  var TOKEN_KEY = 'post-editor-token';
  var DRAFT_FIELDS = ['title', 'description', 'category', 'date', 'tags', 'image', 'body', 'repo', 'branch'];
  // Lines already rendered as block-level markup must not be wrapped in <p>.
  // Declared up here because the first render() runs before the body of the
  // module finishes executing.
  var BLOCK_LEVEL = /^(<h[23]|<ul|<ol|<blockquote|@@BLOCK\d+@@)/;

  var fields = {};
  DRAFT_FIELDS.concat(['token', 'remember']).forEach(function (name) {
    fields[name] = root.querySelector('[data-field="' + name + '"]');
  });

  var preview = root.querySelector('[data-preview]');
  var rawOutput = root.querySelector('[data-raw]');
  var filenameOut = root.querySelector('[data-filename]');
  var status = root.querySelector('[data-status]');
  var wordCount = root.querySelector('[data-count]');

  restore();
  render();

  Object.keys(fields).forEach(function (name) {
    var el = fields[name];
    if (!el) {
      return;
    }
    el.addEventListener('input', onChange);
    el.addEventListener('change', onChange);
  });

  root.querySelectorAll('[data-md]').forEach(function (button) {
    button.addEventListener('click', function () {
      applyMarkdown(button.getAttribute('data-md'));
    });
  });

  root.querySelector('[data-publish]').addEventListener('click', publish);
  root.querySelector('[data-download]').addEventListener('click', download);
  root.querySelector('[data-copy]').addEventListener('click', copyMarkdown);
  root.querySelector('[data-reset]').addEventListener('click', resetDraft);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  function onChange() {
    persist();
    render();
  }

  function value(name) {
    var el = fields[name];
    if (!el) {
      return '';
    }
    return el.type === 'checkbox' ? el.checked : el.value;
  }

  function persist() {
    var draft = {};
    DRAFT_FIELDS.forEach(function (name) {
      draft[name] = value(name);
    });

    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {
      /* storage blocked, the draft simply is not restored next time */
    }

    var token = value('token');
    try {
      if (value('remember')) {
        localStorage.setItem(TOKEN_KEY, token);
        sessionStorage.removeItem(TOKEN_KEY);
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (e) {
      /* ignore */
    }
  }

  function restore() {
    var draft = {};
    try {
      draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    } catch (e) {
      draft = {};
    }

    Object.keys(draft).forEach(function (name) {
      if (fields[name] && draft[name]) {
        fields[name].value = draft[name];
      }
    });

    if (!fields.date.value) {
      fields.date.value = today();
    }

    var stored = null;
    try {
      stored = localStorage.getItem(TOKEN_KEY);
      if (stored) {
        fields.remember.checked = true;
      } else {
        stored = sessionStorage.getItem(TOKEN_KEY);
      }
    } catch (e) {
      stored = null;
    }

    if (stored) {
      fields.token.value = stored;
    }
  }

  function resetDraft() {
    if (!window.confirm('Clear the current draft? The token and repository settings are kept.')) {
      return;
    }

    ['title', 'description', 'tags', 'image', 'body'].forEach(function (name) {
      fields[name].value = '';
    });
    fields.date.value = today();

    persist();
    render();
    setStatus('Draft cleared.', 'ok');
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------
  function render() {
    preview.innerHTML = markdownToHtml(value('body'));
    rawOutput.textContent = buildFile();
    filenameOut.textContent = '_posts/' + filename();

    var words = value('body').trim() ? value('body').trim().split(/\s+/).length : 0;
    wordCount.textContent = words + (words === 1 ? ' word' : ' words');

    warnIfFutureDated();
  }

  // A future date is a silent failure: the file lands in the repo, the build
  // runs, and Jekyll leaves the post out. Say so before the publish button is
  // pressed rather than after.
  function warnIfFutureDated() {
    var chosen = value('date');
    if (chosen && chosen > today() && !status.classList.contains('is-busy')) {
      setStatus(
        'Heads up: ' + chosen + ' is in the future. Jekyll skips future-dated posts, so it will not appear until the site is rebuilt on or after that day.',
        'error'
      );
    }
  }

  function slug(text) {
    return (text || '')
      .toLowerCase()
      .replace(/['"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
  }

  function today() {
    var now = new Date();
    return (
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0')
    );
  }

  function filename() {
    var date = value('date') || today();
    return date + '-' + (slug(value('title')) || 'untitled') + '.md';
  }

  // Jekyll skips posts dated in the future, and GitHub Pages only builds when
  // something is pushed — a post stamped 09:00 and published at 06:30 would
  // simply never appear. So today's posts carry the current wall-clock time,
  // and the offset comes from the machine rather than being hardcoded.
  function timestamp(date) {
    var now = new Date();
    var time = date === today() ? pad(now.getHours()) + ':' + pad(now.getMinutes()) : '09:00';
    return time + ' ' + offset(now);
  }

  function offset(now) {
    var minutes = -now.getTimezoneOffset();
    var sign = minutes < 0 ? '-' : '+';
    var abs = Math.abs(minutes);
    return sign + pad(Math.floor(abs / 60)) + pad(abs % 60);
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  // Builds the Jekyll file: YAML front matter plus the body. `permalink`
  // matches the /posts/:title/ pattern the rest of the site links to.
  function buildFile() {
    var title = value('title') || 'Untitled';
    var date = value('date') || today();
    var tags = value('tags')
      .split(',')
      .map(function (tag) {
        return tag.trim();
      })
      .filter(Boolean);

    var lines = [
      '---',
      'title: ' + yamlString(title),
      'date: ' + date + ' ' + timestamp(date),
      'permalink: /posts/' + (slug(title) || 'untitled') + '/',
      'categories: [' + value('category') + ']'
    ];

    if (tags.length) {
      lines.push('tags: [' + tags.join(', ') + ']');
    }
    if (value('description')) {
      lines.push('description: ' + yamlString(value('description')));
    }
    if (value('image')) {
      lines.push('image: ' + yamlString(value('image')));
    }

    lines.push('author: abelkrw');
    lines.push('---');
    lines.push('');
    lines.push(value('body').trim());
    lines.push('');

    return lines.join('\n');
  }

  // Quote anything YAML could misread: colons, leading symbols, quotes.
  function yamlString(text) {
    return '"' + String(text).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }

  // ---------------------------------------------------------------------------
  // Toolbar
  // ---------------------------------------------------------------------------
  function applyMarkdown(kind) {
    var area = fields.body;
    var start = area.selectionStart;
    var end = area.selectionEnd;
    var selected = area.value.slice(start, end);
    var replacement = selected;
    var caretOffset = 0;

    switch (kind) {
      case 'h2':
        replacement = '## ' + (selected || 'Heading');
        break;
      case 'h3':
        replacement = '### ' + (selected || 'Sub-heading');
        break;
      case 'bold':
        replacement = '**' + (selected || 'bold text') + '**';
        break;
      case 'italic':
        replacement = '_' + (selected || 'italic text') + '_';
        break;
      case 'link':
        replacement = '[' + (selected || 'link text') + '](https://)';
        break;
      case 'list':
        replacement = toLines(selected, '- ', 'First item');
        break;
      case 'numbers':
        replacement = numbered(selected);
        break;
      case 'quote':
        replacement = toLines(selected, '> ', 'Quoted line');
        break;
      case 'code':
        replacement = '```\n' + (selected || 'code here') + '\n```';
        break;
      case 'image':
        replacement = '![' + (selected || 'alt text') + '](/assets/img/)';
        caretOffset = -1;
        break;
      default:
        return;
    }

    // Block-level markup only works at the start of a line.
    var needsBreak = /^(##|###|-\s|>|1\.|```)/.test(replacement) && start > 0 && area.value[start - 1] !== '\n';
    if (needsBreak) {
      replacement = '\n\n' + replacement;
    }

    area.setRangeText(replacement, start, end, 'end');
    area.selectionStart = area.selectionEnd = area.selectionEnd + caretOffset;
    area.focus();
    onChange();
  }

  function toLines(selected, prefix, fallback) {
    if (!selected) {
      return prefix + fallback;
    }
    return selected
      .split('\n')
      .map(function (line) {
        return line.trim() ? prefix + line : line;
      })
      .join('\n');
  }

  function numbered(selected) {
    if (!selected) {
      return '1. First item';
    }
    var n = 0;
    return selected
      .split('\n')
      .map(function (line) {
        if (!line.trim()) {
          return line;
        }
        n += 1;
        return n + '. ' + line;
      })
      .join('\n');
  }

  // ---------------------------------------------------------------------------
  // Markdown preview (toolbar subset only)
  // ---------------------------------------------------------------------------
  function markdownToHtml(source) {
    if (!source.trim()) {
      return '<p class="editor__empty">Nothing to preview yet.</p>';
    }

    var html = escapeHtml(source);

    // Fenced code first: its contents must not be touched by the inline rules.
    var blocks = [];
    html = html.replace(/```([\s\S]*?)```/g, function (match, code) {
      blocks.push('<pre><code>' + code.replace(/^\n|\n$/g, '') + '</code></pre>');
      return '@@BLOCK' + (blocks.length - 1) + '@@';
    });

    html = html
      .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
      .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
      .replace(/^#\s+(.*)$/gm, '<h2>$1</h2>')
      .replace(/^&gt;\s+(.*)$/gm, '<blockquote>$1</blockquote>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|\W)_(.+?)_(\W|$)/g, '$1<em>$2</em>$3')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    html = groupLists(html, /^-\s+(.*)$/, 'ul');
    html = groupLists(html, /^\d+\.\s+(.*)$/, 'ol');

    // Wrap loose text in paragraphs, line by line rather than chunk by chunk:
    // a heading followed by prose on the next line has to produce both a <h2>
    // and a <p>, not one blob starting with a heading.
    html = html
      .split(/\n{2,}/)
      .map(paragraphize)
      .filter(Boolean)
      .join('\n');

    return html.replace(/@@BLOCK(\d+)@@/g, function (match, index) {
      return blocks[Number(index)];
    });
  }

  function paragraphize(chunk) {
    if (!chunk.trim()) {
      return '';
    }

    var out = [];
    var buffer = [];

    var flush = function () {
      if (buffer.length) {
        out.push('<p>' + buffer.join('<br>') + '</p>');
        buffer = [];
      }
    };

    chunk.split('\n').forEach(function (line) {
      var trimmed = line.trim();
      if (!trimmed) {
        return;
      }
      if (BLOCK_LEVEL.test(trimmed)) {
        flush();
        out.push(trimmed);
      } else {
        buffer.push(trimmed);
      }
    });

    flush();
    return out.join('\n');
  }

  function groupLists(html, pattern, tag) {
    var lines = html.split('\n');
    var out = [];
    var buffer = [];

    var flush = function () {
      if (!buffer.length) {
        return;
      }
      out.push('<' + tag + '>' + buffer.join('') + '</' + tag + '>');
      buffer = [];
    };

    lines.forEach(function (line) {
      var match = line.match(pattern);
      if (match) {
        buffer.push('<li>' + match[1] + '</li>');
      } else {
        flush();
        out.push(line);
      }
    });

    flush();
    return out.join('\n');
  }

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ---------------------------------------------------------------------------
  // Publishing
  // ---------------------------------------------------------------------------
  function publish() {
    var title = value('title').trim();
    var body = value('body').trim();
    var repo = value('repo').trim();
    var token = value('token').trim();

    if (!title) {
      return setStatus('Add a title first.', 'error');
    }
    if (!body) {
      return setStatus('The post has no content yet.', 'error');
    }
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
      return setStatus('Repository must look like owner/name.', 'error');
    }
    if (!token) {
      return setStatus(
        'A GitHub token is required to publish. Use Download .md to commit manually instead.',
        'error'
      );
    }

    var path = '_posts/' + filename();
    var url = 'https://api.github.com/repos/' + repo + '/contents/' + path;
    var branch = value('branch').trim() || 'main';

    setStatus('Publishing...', 'busy');

    // A file with the same name may already exist (re-publishing an edit); the
    // API needs its blob sha to update rather than create.
    getSha(url, branch, token)
      .then(function (sha) {
        return fetch(url, {
          method: 'PUT',
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: (sha ? 'Update post: ' : 'Add post: ') + title,
            content: toBase64(buildFile()),
            branch: branch,
            sha: sha || undefined
          })
        });
      })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            throw new Error(data.message || 'GitHub returned ' + response.status);
          }
          return data;
        });
      })
      .then(function (data) {
        var link = data.commit && data.commit.html_url;
        setStatus(
          'Published. GitHub Pages rebuilds in about a minute, then the post appears on the ' +
            value('category') +
            ' page.',
          'ok',
          link
        );
      })
      .catch(function (error) {
        setStatus(describeError(error), 'error');
      });
  }

  function getSha(url, branch, token) {
    return fetch(url + '?ref=' + encodeURIComponent(branch), {
      headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + token }
    }).then(function (response) {
      if (response.status === 404) {
        return null; // new file
      }
      if (!response.ok) {
        return response.json().then(function (data) {
          throw new Error(data.message || 'GitHub returned ' + response.status);
        });
      }
      return response.json().then(function (data) {
        return data.sha;
      });
    });
  }

  function describeError(error) {
    var message = error && error.message ? error.message : String(error);

    if (/Bad credentials/i.test(message)) {
      return 'GitHub rejected the token. Check that it has not expired.';
    }
    if (/Resource not accessible/i.test(message)) {
      return 'The token cannot write to this repository. It needs Contents: read and write on this repo.';
    }
    if (/Not Found/i.test(message)) {
      return 'Repository or branch not found. Check the owner/name and the branch.';
    }
    if (/Failed to fetch/i.test(message)) {
      return 'Could not reach api.github.com. Check the connection and try again.';
    }
    return 'Publish failed: ' + message;
  }

  // btoa() only handles latin1, so UTF-8 has to be encoded byte by byte first.
  function toBase64(text) {
    var bytes = new TextEncoder().encode(text);
    var binary = '';
    bytes.forEach(function (byte) {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  // ---------------------------------------------------------------------------
  // Manual fallbacks
  // ---------------------------------------------------------------------------
  function download() {
    var blob = new Blob([buildFile()], { type: 'text/markdown' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    setStatus('Downloaded ' + filename() + '. Drop it into _posts/ and commit.', 'ok');
  }

  function copyMarkdown() {
    var text = buildFile();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          setStatus('Markdown copied to the clipboard.', 'ok');
        },
        function () {
          setStatus('Could not copy. Open "Show the file" below and copy it by hand.', 'error');
        }
      );
      return;
    }

    setStatus('Clipboard unavailable. Open "Show the file" below and copy it by hand.', 'error');
  }

  function setStatus(message, kind, link) {
    status.textContent = message;
    status.className = 'editor__status is-' + kind;

    if (link) {
      var anchor = document.createElement('a');
      anchor.href = link;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = ' View commit';
      status.appendChild(anchor);
    }
  }
})();
