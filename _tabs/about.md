---
title: About
icon: fas fa-info-circle
order: 1
---

{% assign s = site.data[site.active_lang].strings %}
{% assign f = site.data.en.strings %}

<p class="lead-paragraph">
  {{ s.about_lead | default: f.about_lead }}
</p>

<p>
  {{ s.about_goal | default: f.about_goal }}
</p>

<div class="quick-facts">
  <div class="fact-card">
    <strong>3,000+</strong>
    <span>{{ s.stat_professionals | default: f.stat_professionals }}</span>
  </div>
  <div class="fact-card">
    <strong>1,000+</strong>
    <span>{{ s.stat_learners | default: f.stat_learners }}</span>
  </div>
  <div class="fact-card">
    <strong>10+</strong>
    <span>{{ s.stat_automation | default: f.stat_automation }}</span>
  </div>
  <div class="fact-card">
    <strong>13</strong>
    <span>{{ s.stat_publications | default: f.stat_publications }}</span>
  </div>
</div>

## {{ s.about_what_people_need | default: f.about_what_people_need }}

- {{ s.about_need_1 | default: f.about_need_1 }}
- {{ s.about_need_2 | default: f.about_need_2 }}
- {{ s.about_need_3 | default: f.about_need_3 }}

## {{ s.about_experience_title | default: f.about_experience_title }}

<div class="section-card-grid">
  <div class="section-card">
    <h3>{{ s.about_exp_finance_title | default: f.about_exp_finance_title }}</h3>
    <p>{{ s.about_exp_finance_desc | default: f.about_exp_finance_desc }}</p>
    <ul>
      <li>{{ s.about_exp_finance_1 | default: f.about_exp_finance_1 }}</li>
      <li>{{ s.about_exp_finance_2 | default: f.about_exp_finance_2 }}</li>
    </ul>
  </div>
  <div class="section-card">
    <h3>{{ s.about_exp_community_title | default: f.about_exp_community_title }}</h3>
    <p>{{ s.about_exp_community_desc | default: f.about_exp_community_desc }}</p>
    <ul>
      <li>{{ s.about_exp_community_1 | default: f.about_exp_community_1 }}</li>
      <li>{{ s.about_exp_community_2 | default: f.about_exp_community_2 }}</li>
    </ul>
  </div>
  <div class="section-card">
    <h3>{{ s.about_exp_mentor_title | default: f.about_exp_mentor_title }}</h3>
    <p>{{ s.about_exp_mentor_desc | default: f.about_exp_mentor_desc }}</p>
    <ul>
      <li>{{ s.about_exp_mentor_1 | default: f.about_exp_mentor_1 }}</li>
      <li>{{ s.about_exp_mentor_2 | default: f.about_exp_mentor_2 }}</li>
    </ul>
  </div>
</div>

## {{ s.about_education_title | default: f.about_education_title }}

- {{ s.about_edu_1 | default: f.about_edu_1 }}
- {{ s.about_edu_2 | default: f.about_edu_2 }}
- {{ s.about_edu_3 | default: f.about_edu_3 }}

## {{ s.about_research_title | default: f.about_research_title }}

<p>
  {{ s.about_research_desc | default: f.about_research_desc }}
</p>

<ul>
  <li>Renewable energy adoption modelling using logistic regression. <a href="https://iopscience.iop.org/article/10.1088/1755-1315/127/1/012007/pdf">{{ s.about_pub_link | default: f.about_pub_link }}</a></li>
  <li>Commuter rail operations analysis in Jakarta Metropolitan Area. <a href="https://doi.org/10.1051/matecconf/201927201034">{{ s.about_pub_link | default: f.about_pub_link }}</a></li>
  <li>Augmented reality speech therapy needs identification. <a href="https://ejournal2.undip.ac.id/index.php/jbiomes/article/view/14027">{{ s.about_pub_link | default: f.about_pub_link }}</a></li>
</ul>

<p>
  {{ s.about_closing | default: f.about_closing }} <a href="{{ '/what-i-do/' | relative_url }}">{{ s.section_services_title | default: f.section_services_title }}</a>. {{ s.about_closing_2 | default: f.about_closing_2 }} <a href="{{ '/projects/' | relative_url }}">{{ s.nav_projects_label | default: f.nav_projects_label }}</a>.
</p>
