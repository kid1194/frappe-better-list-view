# Frappe Better List View © 2024
# Author:  Ameen Ahmed
# Company: Level Up Marketing & Software Development Services
# Licence: Please refer to LICENSE file


from .version import is_version_gt


app_name = "frappe_better_list_view"
app_title = "Frappe Better List View"
app_publisher = "Ameen Ahmed (Level Up)"
app_description = "Frappe list view plugin that allows modification."
app_icon = "octicon octicon-list-unordered"
app_color = "blue"
app_email = "kid1194@gmail.com"
app_license = "MIT"


app_include_js = [
    'better_list_view.bundle.js'
] if is_version_gt(13) else ([
    '/assets/frappe_better_list_view/js/better_list_view.js'
] if is_version_gt(12) else [
    '/assets/frappe_better_list_view/js/better_list_view_v12.js'
])