---
layout: page
title: Post Editor
permalink: /post/
noindex: true
sitemap: false
---

<!-- Owner-only authoring tool. The UI stays in English on every locale: it is
     not part of the public site, and translating a tool only the site owner
     opens would add three copies of every label for no reader. -->

<p class="lead-paragraph">
  Write a post, preview it, and publish it straight to the repository. No local
  setup, no Markdown files to move around by hand.
</p>

<!-- PIN gate. The salt and hash come from _data/gate.yml; the PIN itself is
     never stored in the repository. See assets/js/pin-gate.js for what this
     does and does not protect. -->
<div class="gate"
     data-gate
     data-salt="{{ site.data.gate.salt }}"
     data-hash="{{ site.data.gate.hash }}"
     data-iterations="{{ site.data.gate.iterations }}">
  <div class="gate__panel">
    <h2 class="eyebrow">Locked</h2>
    <p class="gate__intro">Enter the PIN to open the editor.</p>

    <form class="gate__form" data-gate-form>
      <label for="gate-pin" class="sr-only">PIN</label>
      <input type="password"
             id="gate-pin"
             class="gate__input"
             data-gate-input
             inputmode="numeric"
             autocomplete="off"
             maxlength="12"
             placeholder="------">
      <button type="submit" class="btn btn-primary">Unlock</button>
    </form>

    <p class="gate__message" data-gate-message role="status" aria-live="polite"></p>
  </div>
</div>

<button type="button" class="btn btn-ghost gate__lock" data-gate-lock hidden>Lock the editor</button>

<div class="editor" data-editor data-gated hidden>
  <!-- ------------------------------------------------------------------ -->
  <!-- Post metadata                                                       -->
  <!-- ------------------------------------------------------------------ -->
  <div class="editor__panel">
    <h2 class="eyebrow">Post details</h2>

    <div class="editor__field">
      <label for="post-title">Title</label>
      <input type="text" id="post-title" data-field="title" placeholder="Tableau dashboard for retail churn" autocomplete="off">
    </div>

    <div class="editor__field">
      <label for="post-description">Summary</label>
      <textarea id="post-description" data-field="description" rows="2" placeholder="One or two sentences. Used as the card text and the search description."></textarea>
    </div>

    <div class="editor__row">
      <div class="editor__field">
        <label for="post-category">Section</label>
        <select id="post-category" data-field="category">
          <option value="Projects">Projects — shows on the Projects page</option>
          <option value="Blogging">Blogging — shows on Insights</option>
          <option value="Testimony">Testimony</option>
        </select>
      </div>

      <div class="editor__field">
        <label for="post-date">Date</label>
        <input type="date" id="post-date" data-field="date">
      </div>
    </div>

    <div class="editor__row">
      <div class="editor__field">
        <label for="post-tags">Tags</label>
        <input type="text" id="post-tags" data-field="tags" placeholder="Data Science, Tableau" autocomplete="off">
      </div>

      <div class="editor__field">
        <label for="post-image">Cover image URL</label>
        <input type="text" id="post-image" data-field="image" placeholder="/assets/img/additional/cia.png" autocomplete="off">
      </div>
    </div>

    <p class="editor__hint">
      File name: <code data-filename>_posts/…</code>
    </p>
  </div>

  <!-- ------------------------------------------------------------------ -->
  <!-- Body + preview                                                      -->
  <!-- ------------------------------------------------------------------ -->
  <div class="editor__panel">
    <h2 class="eyebrow">Content</h2>

    <div class="editor__toolbar" role="toolbar" aria-label="Formatting">
      <button type="button" class="editor__tool" data-md="h2" title="Heading">H2</button>
      <button type="button" class="editor__tool" data-md="h3" title="Sub-heading">H3</button>
      <button type="button" class="editor__tool" data-md="bold" title="Bold"><strong>B</strong></button>
      <button type="button" class="editor__tool" data-md="italic" title="Italic"><em>I</em></button>
      <button type="button" class="editor__tool" data-md="link" title="Link">Link</button>
      <button type="button" class="editor__tool" data-md="list" title="Bullet list">List</button>
      <button type="button" class="editor__tool" data-md="numbers" title="Numbered list">1.</button>
      <button type="button" class="editor__tool" data-md="quote" title="Quote">Quote</button>
      <button type="button" class="editor__tool" data-md="code" title="Code block">Code</button>
      <button type="button" class="editor__tool" data-md="image" title="Image">Image</button>
    </div>

    <div class="editor__field">
      <label for="post-body" class="sr-only">Post body</label>
      <textarea id="post-body" data-field="body" rows="16" placeholder="Write here. Markdown works, and the buttons above insert it for you."></textarea>
    </div>

    <div class="editor__preview-header">
      <h3 class="eyebrow">Preview</h3>
      <span class="editor__count" data-count>0 words</span>
    </div>
    <div class="editor__preview post-content" data-preview></div>
  </div>

  <!-- ------------------------------------------------------------------ -->
  <!-- Publishing                                                          -->
  <!-- ------------------------------------------------------------------ -->
  <div class="editor__panel">
    <h2 class="eyebrow">Publish</h2>

    <p>
      Publishing commits a Markdown file to the repository through the GitHub
      API. GitHub Pages then rebuilds the site, which usually takes about a
      minute.
    </p>

    <div class="editor__row">
      <div class="editor__field">
        <label for="repo-name">Repository</label>
        <input type="text" id="repo-name" data-field="repo" value="AbelKristanto/AbelKristanto.github.io" autocomplete="off">
      </div>

      <div class="editor__field">
        <label for="repo-branch">Branch</label>
        <input type="text" id="repo-branch" data-field="branch" value="main" autocomplete="off">
      </div>
    </div>

    <div class="editor__field">
      <label for="gh-token">GitHub token</label>
      <input type="password" id="gh-token" data-field="token" placeholder="github_pat_…" autocomplete="off" spellcheck="false">
      <p class="editor__hint">
        Use a <strong>fine-grained personal access token</strong> limited to this
        one repository with <strong>Contents: read and write</strong>, and give
        it a short expiry. The token is kept in this tab only and is sent
        directly to api.github.com — nothing else ever sees it. Tick the box
        below only on a device that is yours alone.
      </p>
      <label class="editor__checkbox">
        <input type="checkbox" data-field="remember"> Remember the token in this browser
      </label>
    </div>

    <div class="editor__actions">
      <button type="button" class="btn btn-primary" data-publish>Publish post</button>
      <button type="button" class="btn btn-outline" data-download>Download .md</button>
      <button type="button" class="btn btn-outline" data-copy>Copy Markdown</button>
      <button type="button" class="btn btn-ghost" data-reset>Clear draft</button>
    </div>

    <p class="editor__status" data-status role="status" aria-live="polite"></p>

    <details class="editor__raw">
      <summary>Show the file that will be committed</summary>
      <pre><code data-raw></code></pre>
    </details>
  </div>
</div>

<script src="{{ '/assets/js/pin-gate.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/post-editor.js' | relative_url }}" defer></script>
