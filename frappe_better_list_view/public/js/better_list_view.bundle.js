/*
*  Frappe Better List View © 2022
*  Author:  Ameen Ahmed
*  Company: Level Up Marketing & Software Development Services
*  Licence: Please refer to LICENSE file
*/


frappe.provide("frappe.views");

frappe.views.ListView = class ListView extends frappe.views.ListView {
    setup_defaults() {
        var me = this,
        ret = super.setup_defaults();
        ret.then(function() {
            if (cint(me.settings.page_length))
                me.page_length = cint(me.settings.page_length);
        });
        return ret;
    }
    get_args() {
        var args = super.get_args();
        if (
            Array.isArray(this.settings.get_fields)
            && this.settings.get_fields.length
        ) {
            for (var i = 0, l = this.settings.get_fields.length; i < l; i++) {
                args.fields.push(
                    frappe.model.get_full_column_name(
                        this.settings.get_fields[i],
                        this.doctype
                    )
                );
            }
        }
        return args;
    }
};