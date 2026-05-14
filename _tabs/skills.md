---
title: What I Do
icon: fas fa-layer-group
order: 2
permalink: /what-i-do/
redirect_from:
  - /skills/
---

{% assign s = site.data[site.active_lang].strings %}
{% assign f = site.data.en.strings %}

<p class="lead-paragraph">
  {{ s.skills_lead | default: f.skills_lead }}
</p>

<div class="service-grid">
  <article class="section-card service-card">
    <div class="service-icon"><i class="fas fa-chart-pie"></i></div>
    <h3>{{ s.skills_analytics_title | default: f.skills_analytics_title }}</h3>
    <p>{{ s.skills_analytics_desc | default: f.skills_analytics_desc }}</p>
    <ul>
      <li>Tableau</li>
      <li>Power BI</li>
      <li>SQL</li>
      <li>KNIME Analytics</li>
    </ul>
  </article>
  <article class="section-card service-card">
    <div class="service-icon"><i class="fas fa-gears"></i></div>
    <h3>{{ s.skills_ai_title | default: f.skills_ai_title }}</h3>
    <p>{{ s.skills_ai_desc | default: f.skills_ai_desc }}</p>
    <ul>
      <li>Python</li>
      <li>UiPath</li>
      <li>{{ s.skills_ai_item_workflow | default: f.skills_ai_item_workflow }}</li>
      <li>{{ s.skills_ai_item_llm | default: f.skills_ai_item_llm }}</li>
    </ul>
  </article>
  <article class="section-card service-card">
    <div class="service-icon"><i class="fas fa-user-group"></i></div>
    <h3>{{ s.skills_mentoring_title | default: f.skills_mentoring_title }}</h3>
    <p>{{ s.skills_mentoring_desc | default: f.skills_mentoring_desc }}</p>
    <ul>
      <li>{{ s.skills_mentoring_item_1 | default: f.skills_mentoring_item_1 }}</li>
      <li>{{ s.skills_mentoring_item_2 | default: f.skills_mentoring_item_2 }}</li>
      <li>{{ s.skills_mentoring_item_3 | default: f.skills_mentoring_item_3 }}</li>
    </ul>
  </article>
  <article class="section-card service-card">
    <div class="service-icon"><i class="fas fa-person-chalkboard"></i></div>
    <h3>{{ s.skills_speaking_title | default: f.skills_speaking_title }}</h3>
    <p>{{ s.skills_speaking_desc | default: f.skills_speaking_desc }}</p>
    <ul>
      <li>{{ s.skills_speaking_item_1 | default: f.skills_speaking_item_1 }}</li>
      <li>{{ s.skills_speaking_item_2 | default: f.skills_speaking_item_2 }}</li>
      <li>{{ s.skills_speaking_item_3 | default: f.skills_speaking_item_3 }}</li>
    </ul>
  </article>
</div>

## {{ s.skills_how_title | default: f.skills_how_title }}

<div class="section-card-grid">
  <div class="section-card">
    <h3>{{ s.skills_how_1_title | default: f.skills_how_1_title }}</h3>
    <p>{{ s.skills_how_1_desc | default: f.skills_how_1_desc }}</p>
  </div>
  <div class="section-card">
    <h3>{{ s.skills_how_2_title | default: f.skills_how_2_title }}</h3>
    <p>{{ s.skills_how_2_desc | default: f.skills_how_2_desc }}</p>
  </div>
  <div class="section-card">
    <h3>{{ s.skills_how_3_title | default: f.skills_how_3_title }}</h3>
    <p>{{ s.skills_how_3_desc | default: f.skills_how_3_desc }}</p>
  </div>
</div>

<p>
  {{ s.skills_closing | default: f.skills_closing }} <a href="{{ '/projects/' | relative_url }}">{{ s.nav_projects_label | default: f.nav_projects_label }}</a>.
</p>
