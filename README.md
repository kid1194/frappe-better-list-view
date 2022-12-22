# Frappe Better List View

A small **Frappe** list view plugin that allows the customization.

---

### Table of Contents
- [Requirements](#requirements)
- [Setup](#setup)
  - [Install](#install)
  - [Update](#update)
  - [Uninstall](#uninstall)
- [Available Options](#available-options)
- [Example](#example)
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

5. Check the [Available Options](#available-options) and [Example](#example)

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
### 1. `query_fields`

List of additional fields to fetch but not display.

**Example:**
```
['is_approved', 'is_paid']
```

### 2. `query_filters`

List of additional filters for the fetch query.

**Example:**
```
{is_approved: 1, is_paid: 0}
```
--OR--
```
[['is_approved', '=', 1], ['is_paid', '=', 0]]
```

### 3. `page_length`

Number of rows to display per page.

**Example:**
```
50
```

### 4. `parser`

Function to modify the list data before display.

**Arguments:** `data`, `render`

**Must call** `render()` **after modification is done to render the list.**

**Examples:**
```
function(data, render) {
    let names = [];
    data.forEach(function(row) {
        names.push(row.name);
    });
    frappe.db.get_list('Doctype', {
        fields: ['name', 'value'],
        filters: {
            name: ['in', names],
        }
    }).then(function(list) {
        list.forEach(function(vals) {
            data.forEach(function(row) {
                if (vals.name === row.name) {
                    row.value = vals.value;
                }
            });
        });
        render();
    });
}
```

### 5. `set_row_background`

Function to set the background color of row, (css, hex, rgb, rgba, hsla).

**Arguments:** `row`

**Return:** `String`, `Null`

**CSS Colors:**
<div style="width:100%;text-align:center">
    <img src="https://github.com/kid1194/frappe-better-list-view/blob/main/images/row_bg.png?raw=true" alt="Frappe Better List View"/>
</div>

**Examples:**
```
function(row) {
    if (cint(row.cost) > 1000) return 'danger';
    if (cint(row.cost) > 800) return '#ffeeba';
    if (cint(row.cost) > 600) return 'rgba(190,229,235,1)';
    if (cint(row.cost) < 300) return 'hsla(133.7,41.2%,83.3%,1)';
}
```

---

### Example

```
frappe.listview_settings['DocType'] = {
    --------------------------------------------------------------------
    --- Plugin Options -------------------------------------------------
    --------------------------------------------------------------------
    
    // Columns to fetch but not display
    query_fields: ['is_approved', 'is_paid'],
    // Additional filters (array or object) for fetch query
    query_filters: {
        is_approved: 1,
        is_paid: 1,
    },
    // Only 50 rows will be displayed per page
    page_length: 50,
    // List data modify function 
    parser: function(data, render) {
        let names = [];
        data.forEach(function(row) {
            names.push(row.name);
        });
        if (!names.length) {
            return render();
        }
        frappe.db.get_list('Doctype', {
            fields: ['name', 'price'],
            filters: {
                name: ['in', names],
                is_approved: 1,
            }
        }).then(function(list) {
            list.forEach(function(vals) {
                data.forEach(function(row) {
                    if (vals.name === row.name) {
                        row.price = vals.price;
                    }
                });
            });
            render();
        });
    },
    set_row_background: function(row) {
        if (!cint(row.is_approved)) return 'info';
    },
    
    --------------------------------------------------------------------
    
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

### Issues
If you find bug in the plugin, please create a [bug report](https://github.com/kid1194/frappe-better-list-view/issues/new?assignees=kid1194&labels=bug&template=bug_report.md&title=%5BBUG%5D) and let us know about it.

---

### License
This repository has been released under the [MIT License](https://github.com/kid1194/frappe-better-list-view/blob/main/LICENSE).
