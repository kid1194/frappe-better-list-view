/*
*  Frappe Better List View © 2022
*  Author:  Ameen Ahmed
*  Company: Level Up Marketing & Software Development Services
*  Licence: Please refer to LICENSE file
*/


frappe.provide("frappe.views");

frappe.views.ListView = class ListView extends frappe.views.ListView {
    get_args() {
        var args = super.get_args();
        if ($.isPlainObject(this.settings.query)) {
            if ($.isArray(this.settings.query.fields)) {
                for (var i in this.settings.query.fields) {
                    var field = frappe.model.get_full_column_name(
                        this.settings.query.fields[i],
                        this.doctype
                    );
                    if (args.fields.indexOf(field) < 0) {
                        args.fields.push(field);
                    }
                }
            }
            if (
                $.isPlainObject(this.settings.query.filters)
                || $.isArray(this.settings.query.filters)
            ) {
                var get_query_filter = function(doctype, cond, column) {
                    var sign = '=',
                    value = cond;
                    if ($.isArray(cond)) {
                        var len = cond.length;
                        if (len < 2) return null;
                        var i = 0;
                        if (len > 2) column = cond[i++];
                        sign = cond[i++];
                        value = cond[i++];
                    }
                    return [doctype, column, sign, value];
                };
                for (var key in this.settings.query.filters) {
                    var cond = get_query_filter(
                        this.doctype,
                        this.settings.query.filters[key],
                        key
                    );
                    if (cond && args.filters.indexOf(cond) < 0) {
                        args.filters.push(cond);
                    }
                }
            }
            if (cint(this.settings.query.page_length)) {
                args.page_length = cint(this.settings.query.page_length);
            }
        }
        return args;
    }
    render() {
        if (
            !this._inside_parser
            && this.settings.query.parser
            && typeof this.settings.query.parser === 'function'
        ) {
            var me = this,
            tasks = [];
            $.each(this.data, function(i, row) {
                tasks.push(new Promise(function(resolve, reject) {
                    try {
                        me.settings.query.parser(row, resolve);
                    } catch(e) {
                        reject(e);
                    }
                }));
            });
            if (tasks.length) {
                var render = function() {
                    me._inside_parser = true;
                    me.render();
                    me._inside_parser = false;
                };
                Promise.all(tasks)
                .catch(render)
                .finally(render);
                return;
            }
        }
        super.render();
    }
};