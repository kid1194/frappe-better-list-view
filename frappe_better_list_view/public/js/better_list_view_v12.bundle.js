/*
*  Frappe Better List View © 2022
*  Author:  Ameen Ahmed
*  Company: Level Up Marketing & Software Development Services
*  Licence: Please refer to LICENSE file
*/


frappe.views.ListView = class ListView extends frappe.views.ListView {
    get_args() {
        var args = super.get_args();
        if (!args.doctype || args.doctype !== this.doctype) {
            frappe.throw(__('Invalid list args.'));
            return args;
        }
        if (
            $.isArray(this.settings.query_fields)
            && this.settings.query_fields.length
        ) {
            for (var i in this.settings.query_fields) {
                var field = frappe.model.get_full_column_name(
                    this.settings.query_fields[i],
                    this.doctype
                );
                if (args.fields.indexOf(field) < 0)
                    args.fields.push(field);
            }
        }
        if (
            (
                $.isPlainObject(this.settings.query_filters)
                && !$.isEmptyObject(this.settings.query_filters)
            ) || (
                $.isArray(this.settings.query_filters)
                && this.settings.query_filters.length
            )
        ) {
            let get_query_filter = function(doctype, cond, column) {
                let sign = '=',
                value = cond;
                if ($.isArray(cond)) {
                    let len = cond.length,
                    i = 0;
                    if (len < 2) return;
                    if (len > 2) column = cond[i++];
                    sign = cond[i++];
                    value = cond[i++];
                }
                return [doctype, column, sign, value];
            };
            for (let key in this.settings.query_filters) {
                let cond = get_query_filter(
                    this.doctype,
                    this.settings.query_filters[key],
                    key
                );
                if (cond && args.filters.indexOf(cond) < 0)
                    args.filters.push(cond);
            }
        }
        if (cint(this.settings.page_length)) {
            args.page_length = cint(this.settings.page_length);
        }
        return args;
    }
    render() {
        if (!this.settings.parser && $.isFunction(this.settings.data_parser)) {
            this.settings.parser = this.settings.data_parser;
        }
        if (!this._parsed_list && $.isFunction(this.settings.parser)) {
            var me = this;
            (new Promise(function(resolve, reject) {
                try {
                    me.settings.parser(me.data, resolve);
                } catch(e) { reject(e); }
            })).finally(function() {
                if (me._parsed_list) return;
                me._parsed_list = 1;
                me.render();
            });
            return;
        }
        super.render();
    }
    get_list_row_html(doc) {
        let html = super.get_list_row_html(doc);
        if (!$.isFunction(this.settings.set_row_background)) return html;
        let css = 'level list-row',
        color = this.settings.set_row_background(doc);
        if (color && [
            'active', 'primary', 'secondary', 'success',
            'danger', 'warning', 'info',
        ].indexOf(color) >= 0) {
            html = html.replace(css, css + ' table-' + color);
        }
        return html;
    }
};