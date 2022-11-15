# Frappe Better List View

A small plugin for Frappe that modifies the list view to allow:
1. Setting the number of rows displayed per page
2. fetching a list of fields without displaying their values

```
frappe.listview_settings['DocType'] = {
    // Only 50 rows will be displayed per page
    page_length: 50,
    // No columns will be created for these fields  
    get_fields: ['is_approved', 'is_paid'],
    // The fields listed above can be used inside the following functions
    get_indicator: function(doc) {
        if (doc.is_paid) {
            return [__('Paid'), 'blue', 'is_paid,=,Yes|is_approved,=,Yes'];
        }
        if (doc.is_approved) {
            return [__('Approved'), 'green', 'is_paid,=,No|is_approved,=,Yes'];
        }
        return [__('Pending'), 'gray', 'is_paid,=,No|is_approved,=,No'];
    },
    formatters: {
        name: function(value, field, doc) {
            let html = value;
            if (doc.is_approved) {
                html += ' <span class="fa fa-check"></span>';
            }
            return html;
        },
    },
};
```

---

### Table of Contents
- [Requirements](#requirements)
- [Setup](#setup)
  - [Install](#install)
  - [Update](#update)
  - [Uninstall](#uninstall)
- [Available Options](#available-options)
- [Issues](#issues)
- [License](#license)

---

### Requirements
- Frappe >= v12.0.0

---

### Setup

⚠️ *Important* ⚠️

*Do not forget to replace [sitename] with the name of your site in all commands.*

#### Install
1. Go to bench directory

```
cd ~/frappe-bench
```

2. Get plugin from Github

*(Required only once)*

```
bench get-app https://github.com/kid1194/frappe-better-list-view
```

3. Build plugin

*(Required only once)*

```
bench build --app frappe_better_list_view
```

4. Install plugin on a specific site

```
bench --site [sitename] install-app frappe_better_list_view
```

5. Check the usage section below

#### Update
1. Go to app directory

```
cd ~/frappe-bench/apps/frappe_better_list_view
```

2. Get updates from Github

```
git pull
```

3. Go to bench directory

```
cd ~/frappe-bench
```

4. Build plugin

```
bench build --app frappe_better_list_view
```

5. Update a specific site

```
bench --site [sitename] migrate
```

6. (Optional) Restart bench

```
bench restart
```

#### Uninstall
1. Go to bench directory

```
cd ~/frappe-bench
```

2. Uninstall plugin from a specific site

```
bench --site [sitename] uninstall-app frappe_better_list_view
```

3. Remove plugin from bench

```
bench remove-app frappe_better_list_view
```

4. (Optional) Restart bench

```
bench restart
```

---

### Available Options
1. `page_length`

The number of rows to display per page
- Type: `Integer`
- Example: `50`

2. `get_fields`

The list of fields to fetch without displaying their values
- Type: `Array`
- Example: `['currency', 'exchange_rate']`

---

### Issues
If you find bug in the plugin, please create a [bug report](https://github.com/kid1194/frappe-better-list-view/issues/new?assignees=kid1194&labels=bug&template=bug_report.md&title=%5BBUG%5D) and let us know about it.

---

### License
This repository has been released under the [MIT License](https://github.com/kid1194/frappe-better-list-view/blob/main/LICENSE).
