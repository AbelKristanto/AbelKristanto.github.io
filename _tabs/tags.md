---
title: Contact
icon: fas fa-envelope
order: 6
permalink: /contact/
---

{% assign s = site.data[site.active_lang].strings %}
{% assign f = site.data.en.strings %}

<p class="lead-paragraph">
  {{ s.contact_lead | default: f.contact_lead }}
</p>

<div class="contact-grid">
  <article class="section-card">
    <h3>{{ s.contact_email_title | default: f.contact_email_title }}</h3>
    <p>{{ s.contact_email_desc | default: f.contact_email_desc }}</p>
    <a href="mailto:{{ site.social.email }}" class="btn btn-primary btn-sm">{{ s.contact_email_cta | default: f.contact_email_cta }}</a>
  </article>
  <article class="section-card">
    <h3>{{ s.contact_linkedin_title | default: f.contact_linkedin_title }}</h3>
    <p>{{ s.contact_linkedin_desc | default: f.contact_linkedin_desc }}</p>
    <a href="{{ site.social.links[0] }}" class="btn btn-outline-primary btn-sm" target="_blank" rel="noopener noreferrer">{{ s.contact_linkedin_cta | default: f.contact_linkedin_cta }}</a>
  </article>
  <article class="section-card">
    <h3>{{ s.contact_github_title | default: f.contact_github_title }}</h3>
    <p>{{ s.contact_github_desc | default: f.contact_github_desc }}</p>
    <a href="https://github.com/{{ site.github.username }}" class="btn btn-outline-primary btn-sm" target="_blank" rel="noopener noreferrer">{{ s.contact_github_cta | default: f.contact_github_cta }}</a>
  </article>
  <article class="section-card">
    <h3>{{ s.contact_channels_title | default: f.contact_channels_title }}</h3>
    <p>{{ s.contact_channels_desc | default: f.contact_channels_desc }}</p>
    <div class="cta-row">
      <a href="https://medium.com/@abelkrw" class="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">Medium</a>
      <a href="https://www.youtube.com/@abelkrw?sub_confirmation=1" class="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">YouTube</a>
    </div>
  </article>
</div>

## {{ s.contact_reasons_title | default: f.contact_reasons_title }}

- {{ s.contact_reason_1 | default: f.contact_reason_1 }}
- {{ s.contact_reason_2 | default: f.contact_reason_2 }}
- {{ s.contact_reason_3 | default: f.contact_reason_3 }}
- {{ s.contact_reason_4 | default: f.contact_reason_4 }}
