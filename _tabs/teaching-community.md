---
title: Teaching
icon: fas fa-people-group
order: 4
permalink: /teaching-community/
---

{% assign s = site.data[site.active_lang].strings %}
{% assign f = site.data.en.strings %}

<p class="lead-paragraph">
  {{ s.teaching_lead | default: f.teaching_lead }}
</p>

<div class="quick-facts">
  <div class="fact-card">
    <strong>1,000+</strong>
    <span>{{ s.stat_learners | default: f.stat_learners }}</span>
  </div>
  <div class="fact-card">
    <strong>3,000+</strong>
    <span>{{ s.stat_professionals | default: f.stat_professionals }}</span>
  </div>
  <div class="fact-card">
    <strong>14+</strong>
    <span>learning classes delivered through community initiatives</span>
  </div>
</div>

## {{ s.teaching_areas_title | default: f.teaching_areas_title }}

<div class="section-card-grid">
  <div class="section-card">
    <h3>{{ s.teaching_dqlab_title | default: f.teaching_dqlab_title }}</h3>
    <p>{{ s.teaching_dqlab_desc | default: f.teaching_dqlab_desc }}</p>
  </div>
  <div class="section-card">
    <h3>{{ s.teaching_bumn_title | default: f.teaching_bumn_title }}</h3>
    <p>{{ s.teaching_bumn_desc | default: f.teaching_bumn_desc }}</p>
  </div>
  <div class="section-card">
    <h3>{{ s.teaching_esploor_title | default: f.teaching_esploor_title }}</h3>
    <p>{{ s.teaching_esploor_desc | default: f.teaching_esploor_desc }}</p>
  </div>
</div>

## {{ s.teaching_talks_title | default: f.teaching_talks_title }}

- Machine Learning and AI for Beginners, DQLab, 2023 to 2025
- Data Analytics with Power BI, Toyota Astra Motor, 2025
- Data Analyst with SQL and Python, DQLab, 2023
- Introduction to Machine Learning, BTN, 2022

## {{ s.teaching_values_title | default: f.teaching_values_title }}

- {{ s.teaching_value_1 | default: f.teaching_value_1 }}
- {{ s.teaching_value_2 | default: f.teaching_value_2 }}
- {{ s.teaching_value_3 | default: f.teaching_value_3 }}

<p>
  If you want to discuss a class, workshop, or speaking invitation, use the <a href="{{ '/contact/' | relative_url }}">Contact</a> page.
</p>
