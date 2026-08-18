---
title: Projects
icon: fas fa-briefcase
order: 3
permalink: /projects/
redirect_from:
  - /portfolio/
---

{% assign s = site.data[site.active_lang].strings %}
{% assign f = site.data.en.strings %}

<p class="lead-paragraph">
  {{ s.projects_lead | default: f.projects_lead }}
</p>

<div class="project-grid">
  <article class="project-card">
    <img src="{{ '/assets/img/additional/cia.png' | relative_url }}" alt="{{ s.project_dashboard_title | default: f.project_dashboard_title }}">
    <div>
      <p class="project-kicker">{{ s.project_dashboard_kicker | default: f.project_dashboard_kicker }}</p>
      <h3>{{ s.project_dashboard_title | default: f.project_dashboard_title }}</h3>
      <p>{{ s.project_dashboard_desc | default: f.project_dashboard_desc }}</p>
      <p><strong>{{ s.projects_value_label | default: f.projects_value_label }}:</strong> {{ s.project_dashboard_value | default: f.project_dashboard_value }}</p>
      <a href="{{ '/posts/tableau-dashboard-collection/' | relative_url }}" class="btn btn-outline-primary btn-sm">{{ s.project_dashboard_cta | default: f.project_dashboard_cta }}</a>
    </div>
  </article>

  <article class="project-card">
    <div>
      <p class="project-kicker">{{ s.project_esploor_kicker | default: f.project_esploor_kicker }}</p>
      <h3>{{ s.project_esploor_title | default: f.project_esploor_title }}</h3>
      <p>{{ s.project_esploor_desc | default: f.project_esploor_desc }}</p>
      <p><strong>{{ s.projects_value_label | default: f.projects_value_label }}:</strong> {{ s.project_esploor_value | default: f.project_esploor_value }}</p>
      <div class="cta-row">
        <a href="{{ '/posts/esploor-research-program/' | relative_url }}" class="btn btn-outline-primary btn-sm">{{ s.project_esploor_cta | default: f.project_esploor_cta }}</a>
        <a href="https://www.instagram.com/esploorcom" class="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">ESPLOOR</a>
      </div>
    </div>
  </article>

  <article class="project-card">
    <div>
      <p class="project-kicker">{{ s.project_chatbot_kicker | default: f.project_chatbot_kicker }}</p>
      <h3>{{ s.project_chatbot_title | default: f.project_chatbot_title }}</h3>
      <p>{{ s.project_chatbot_desc | default: f.project_chatbot_desc }}</p>
      <p><strong>{{ s.projects_value_label | default: f.projects_value_label }}:</strong> {{ s.project_chatbot_value | default: f.project_chatbot_value }}</p>
      <a href="{{ '/posts/ai-chatbot-prototype/' | relative_url }}" class="btn btn-outline-primary btn-sm">{{ s.project_chatbot_cta | default: f.project_chatbot_cta }}</a>
    </div>
  </article>

  <article class="project-card">
    <div>
      <p class="project-kicker">{{ s.project_speech_kicker | default: f.project_speech_kicker }}</p>
      <h3>{{ s.project_speech_title | default: f.project_speech_title }}</h3>
      <p>{{ s.project_speech_desc | default: f.project_speech_desc }}</p>
    </div>
  </article>

  <article class="project-card">
    <div>
      <p class="project-kicker">{{ s.project_pillow_kicker | default: f.project_pillow_kicker }}</p>
      <h3>{{ s.project_pillow_title | default: f.project_pillow_title }}</h3>
      <p>{{ s.project_pillow_desc | default: f.project_pillow_desc }}</p>
    </div>
  </article>

  <article class="project-card">
    <div>
      <p class="project-kicker">{{ s.project_ops_kicker | default: f.project_ops_kicker }}</p>
      <h3>{{ s.project_ops_title | default: f.project_ops_title }}</h3>
      <p>{{ s.project_ops_desc | default: f.project_ops_desc }}</p>
    </div>
  </article>
</div>

{% comment %}
  Posts published through /post/ land in the "Projects" category and show up
  here automatically, newest first. Nothing to edit by hand after publishing.
{% endcomment %}
{% assign published = site.posts | where_exp: "post", "post.categories contains 'Projects'" %}
{% if published.size > 0 %}
<h2>{{ s.projects_published_title | default: f.projects_published_title }}</h2>

<div class="project-grid">
  {% for post in published %}
    <a class="post-card" href="{{ post.url | relative_url }}">
      <span class="post-card__date">{{ post.date | date: "%d %b %Y" }}</span>
      <h3 class="post-card__title">{{ post.title }}</h3>
      <p class="post-card__excerpt">{{ post.description | default: post.excerpt | strip_html | truncate: 150 }}</p>
      {% if post.tags.size > 0 %}
        <div class="post-card__tags">
          {% for tag in post.tags %}<span class="post-card__tag">{{ tag }}</span>{% endfor %}
        </div>
      {% endif %}
    </a>
  {% endfor %}
</div>
{% endif %}

<p>
  {{ s.projects_closing | default: f.projects_closing }}
</p>
