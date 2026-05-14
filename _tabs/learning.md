---
title: Learn
icon: fas fa-book
order: 5
permalink: /learning/
---

{% assign s = site.data[site.active_lang].strings %}
{% assign f = site.data.en.strings %}

## {{ s.learning_title | default: f.learning_title }}

{{ s.learning_desc | default: f.learning_desc }} [{{ s.learning_open_tab | default: f.learning_open_tab }}](https://data-science-learning.gitbook.io/repository-datalab){:target="_blank"}.

{% include embed-container.html src="https://data-science-learning.gitbook.io/repository-datalab" type="document" title="Data Science Learning Repository - GitBook" fallback_url="https://data-science-learning.gitbook.io/repository-datalab" fallback_text="The learning materials cannot be embedded directly. Please open them in a new tab." %}
