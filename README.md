# Frappe Better List View

A small **Frappe** list view plugin that allows customization.

![v1.4.0](https://img.shields.io/badge/v1.4.0-2024/05/30-green?style=plastic)

---

### Table of Contents
- [Requirements](#requirements)
- [Setup](#setup)
  - [Install](#install)
  - [Update](#update)
  - [Uninstall](#uninstall)
- [Usage](#usage)
  - [Options](#options)
  - [Methods](#methods)
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

```
bench get-app https://github.com/kid1194/frappe-better-list-view
```

3. Build plugin

```
bench build --app frappe_better_list_view
```

4. Install plugin on a specific site

```
bench --site [sitename] install-app frappe_better_list_view
```

5. (Optional) Restart bench to clear cache

```
bench restart
```

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

6. (Optional) Restart bench to clear cache

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

4. (Optional) Restart bench to clear cache

```
bench restart
```

---

### Usage

#### Options
##### 1. `status` 🔴

Status object to enable or disable ListView.

**Keys:**
| Key | Type | Description |
| :--- | :--- | :--- |
| `enable` | Boolean | Enable or disable.<br /><br />Default: `true` |
| `message` | String | Disabled message.<br /><br />Default: `ListView is disabled.` |
| `color` | String | Message text color.<br /><br />Colors: `green`, `blue`, `orange`, `gray`, `red`<br /><br />Default: `red` |

**Example:**
```
{
    enable: false,
    message: __('ListView is disabled.'),
    color: 'red'
}
```

##### 2. `query_fields`

List of additional fields to fetch but not display.

**Example:**
```
['is_approved', 'is_paid']
```

##### 3. `query_filters`

List of additional filters for the fetch query.

**Example:**
```
{is_approved: 1, is_paid: 0}
```
--OR--
```
[['is_approved', '=', 1], ['is_paid', '=', 0]]
```

##### 4. `page_length`

Number of rows to display per page.

**Example:**
```
50
```

##### 5. `parser`

Function to modify the list data before display.

**Arguments:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `data` | Array | Data list before display. |
| `render` | Function | ⚠️ Must be called after data parsing is done to render ListView. |
| `error` | Function | ⚠️ Must be called when an error is raised to ignore all data modification. |

⚠️ *Important* ⚠️
If an error isn't caught inside the parser function, all data modification will be ignored and original data will be rendered automatically instead.

**Examples:**
```
function(data, render, error) {
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
        // Render modified data
        render();
    }).catch(function(e) {
        console.error(e.message, e.stack);
        // Render original data instead
        error();
    });
}
```

##### 6. `set_row_background`

Function to set the row background color.

**Arguments:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `row` | Plain Object | ListView row data object. |


**Return:**
| Type | Description |
| :--- | :--- |
| `String` | Row background color.<br /><br />Color Type: `CSS Key`, `Hex`, `RGB`, `RGBA` or `HSLA`. |
| `Null` | No row background color. |


**CSS Colors & Keys:**
<p align="center">
    <img src="https://github.com/kid1194/frappe-better-list-view/blob/main/images/row_bg.png?raw=true" alt="Frappe Better List View"/>
</p>

**Examples:**
```
function(row) {
    if (cint(row.cost) > 1000) return 'danger';
    if (cint(row.cost) > 800) return '#ffeeba';
    if (cint(row.cost) > 600) return 'rgb(190,229,235)';
    if (cint(row.cost) > 400) return 'rgba(190,229,235,1)';
    if (cint(row.cost) < 200) return 'hsla(133.7,41.2%,83.3%,1)';
}
```

#### Methods
##### 1. `toggle_status`

Method to enable or disable ListView on demand. It can be called from within `onload` event.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `enable` | Boolean | Enable or disable.<br /><br />Default: `true` |
| `message` | String | Disabled message.<br /><br />Default: `ListView is disabled.` |
| `color` | String | Message text color.<br /><br />Colors: `green`, `blue`, `orange`, `gray`, `red`<br /><br />Default: `red` |


**Example:**
```
frappe.listview_settings['DocType'] = {
    onload: function(listview) {
        if (!frappe.user_roles.includes('Some Role')) {
            listview.toggle_status(false, __('ListView is disabled.'), 'red');
        }
    }
};
```

#### Example

```
frappe.listview_settings['DocType'] = {
    /*
     *---------------------------------------------------
     *---------- 🔴 Plugin Custom Options 🔴 ------------
     *---------------------------------------------------
     */
    
    /*
     * 1. ListView status
     */
    status: {
        enable: false,
        message: __('ListView is disabled.'),
        color: 'red'
    },
    /*
     * 2. Fields to fetch but not display
     */
    query_fields: ['is_approved', 'is_paid'],
    /*
     * 3. Additional filters (array or object) for fetch query
     */
    query_filters: {
        is_approved: 1,
        is_paid: 1,
    },
    /*
     * 4. Only 50 rows will be displayed per page
     */
    page_length: 50,
    /*
     * 5. List data modify function
     */
    parser: function(data, render, error) {
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
            // Render modified data
            render();
        }).catch(function(e) {
            console.error(e.message, e.stack);
            // Render original data instead
            error();
        });
    },
    /*
     * 6. Custom row background color
     */
    set_row_background: function(row) {
        if (!cint(row.is_approved)) return 'info';
    },
    
    
    /*
     *---------------------------------------------------
     *-------- 🔵 ListView Options & Events 🔵 ----------
     *---------------------------------------------------
     */
    
    /*
     * 1. Onload event
     *
     * ListView status can be toggled and changed using
     * the method "toggle_status" added by the plugin.
     */
    onload: function(listview) {
        if (!frappe.user_roles.includes('Some Role')) {
            listview.toggle_status(false, __('ListView is disabled.'), 'red');
        }
    },
    /*
     * 2. Custom indicator method
     *
     * Additional fields listed in the "query_fields" option above
     * are added to the "doc" object and can be accessed directly.
     */
    get_indicator: function(doc) {
        if (doc.is_paid) {
            return [__('Paid'), 'blue', 'is_paid,=,Yes|is_approved,=,Yes'];
        }
        if (doc.is_approved) {
            return [__('Approved'), 'green', 'is_paid,=,No|is_approved,=,Yes'];
        }
        return [__('Pending'), 'gray', 'is_paid,=,No|is_approved,=,No'];
    },
    /*
     * 2. Column data formatters
     *
     * Additional fields listed in the "query_fields" option above
     * are added to the "doc" object and can be accessed directly.
     */
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
If you find a bug, please create a [bug report](https://github.com/kid1194/frappe-better-list-view/issues/new?assignees=kid1194&labels=bug&template=bug_report.md&title=%5BBUG%5D) and let us know about it.

---

### License
This plugin has been released under the [MIT License](https://github.com/kid1194/frappe-better-list-view/blob/main/LICENSE).
