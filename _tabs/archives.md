---
title: Insights
icon: fas fa-pen-nib
order: 7
permalink: /insights/
redirect_from:
  - /archives/
---

{% assign s = site.data[site.active_lang].strings %}
{% assign f = site.data.en.strings %}

<p class="lead-paragraph">
  {{ s.insights_lead | default: f.insights_lead }}
</p>

## {{ s.insights_start_title | default: f.insights_start_title }}

<div class="section-card-grid">
  <div class="section-card">
    <h3><a href="{{ '/posts/tableau-dashboard-collection/' | relative_url }}">{{ s.work_dashboard_title | default: f.work_dashboard_title }}</a></h3>
    <p>{{ s.insights_card_dashboard_desc | default: f.insights_card_dashboard_desc }}</p>
  </div>
  <div class="section-card">
    <h3><a href="{{ '/posts/esploor-research-program/' | relative_url }}">{{ s.work_esploor_title | default: f.work_esploor_title }}</a></h3>
    <p>{{ s.insights_card_esploor_desc | default: f.insights_card_esploor_desc }}</p>
  </div>
  <div class="section-card">
    <h3><a href="{{ '/posts/ai-chatbot-prototype/' | relative_url }}">{{ s.work_chatbot_title | default: f.work_chatbot_title }}</a></h3>
    <p>{{ s.insights_card_chatbot_desc | default: f.insights_card_chatbot_desc }}</p>
  </div>
</div>

## {{ s.insights_browse_title | default: f.insights_browse_title }}

### {{ s.insights_topic_projects | default: f.insights_topic_projects }}

- [Interactive Data Portfolio]({{ '/posts/interactive-data-portfolio/' | relative_url }})
- [Tableau Dashboard Collection]({{ '/posts/tableau-dashboard-collection/' | relative_url }})
- [AI Chatbot Prototype]({{ '/posts/ai-chatbot-prototype/' | relative_url }})

### {{ s.insights_topic_programs | default: f.insights_topic_programs }}

- [Esploor Research Program]({{ '/posts/esploor-research-program/' | relative_url }})
- [Esploor Challenge]({{ '/posts/esploor-challenge/' | relative_url }})

### {{ s.insights_topic_reflections | default: f.insights_topic_reflections }}

- [Life Testimony]({{ '/posts/life-testimony/' | relative_url }})
- [God Words]({{ '/posts/god-words/' | relative_url }})

<p>
  {{ s.insights_language_note | default: f.insights_language_note }}
</p>
