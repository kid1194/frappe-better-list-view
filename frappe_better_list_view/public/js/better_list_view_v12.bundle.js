/*
*  Frappe Better List View © 2024
*  Author:  Ameen Ahmed
*  Company: Level Up Marketing & Software Development Services
*  Licence: Please refer to LICENSE file
*/


frappe.views.ListView = class ListView extends frappe.views.ListView {
    constructor(opts) {
		super(opts);
		this._is_enabled = true;
		this._row_class = 'level list-row';
		this._row_backgrounds = [
            'active', 'primary', 'secondary',
            'success', 'danger', 'warning', 'info',
        ];
	}
	toggle_status(enable, message, color) {
	    if (enable) {
            this._is_enabled = true;
            this.page.clear_inner_toolbar();
            this.set_primary_action();
	    } else {
	        this._is_enabled = false;
            this.page.hide_actions_menu();
            this.page.clear_primary_action();
            this.page.clear_inner_toolbar();
            message = message || __('ListView is disabled.');
            color = color || 'red';
            let colors = {
                green: 'success',
                blue: 'info',
                orange: 'warning',
                gray: 'muted',
                red: 'danger'
            };
            this.page.add_inner_message(message)
                .removeClass('text-muted')
                .addClass('text-' + (colors[color] || colors.red));
	    }
	}
	set_primary_action() {
        if (this._is_enabled) super.set_primary_action();
        else this.page.clear_primary_action();
    }
	toggle_actions_menu_button() {
        if (this._is_enabled)
            super.toggle_actions_menu_button();
    }
    get_args() {
        var args = super.get_args();
        if (!args.doctype || args.doctype !== this.doctype) {
            console.error(__('Invalid list args.'));
            return args;
        }
        var i = 0, l = 0, field;
        if (
            $.isArray(this.settings.query_fields)
            && this.settings.query_fields.length
        ) {
            for (i = 0, l = this.settings.query_fields.length; i < l; i++) {
                field = frappe.model.get_full_column_name(
                    this.settings.query_fields[i],
                    this.doctype
                );
                if (args.fields.indexOf(field) < 0)
                    args.fields.push(field);
            }
        }
        if (
            $.isPlainObject(this.settings.query_filters)
            && !$.isEmptyObject(this.settings.query_filters)
        ) {
            for (var key in this.settings.query_filters) {
                this._add_query_filter(args, key);
            }
        } else if (
            $.isArray(this.settings.query_filters)
            && this.settings.query_filters.length
        ) {
            for (i = 0, l = this.settings.query_filters.length; i < l; i++) {
                this._add_query_filter(args, i);
            }
        }
        if (cint(this.settings.page_length)) {
            args.page_length = cint(this.settings.page_length);
        }
        return args;
    }
    render() {
        if (this._data_rendered) {
            delete this._data_rendered;
            super.render_list();
            return;
        }
        if (!this.settings.parser && $.isFunction(this.settings.data_parser)) {
            this.settings.parser = this.settings.data_parser;
        }
        if (!$.isFunction(this.settings.parser)) {
            super.render_list();
            return;
        }
        var me = this,
        clone = this.data.slice();
        for (var i = 0, l = clone.length; i < l; i++) {
            clone[i] = Object.assign({}, clone[i]);
        }
        var promise = new Promise(function(resolve, reject) {
            try {
                me.settings.parser(me.data, resolve, reject);
            } catch(e) { reject(); }
        });
        promise.then(
            function() { clone = null; },
            function() { me.data = clone; }
        );
        promise.catch(function() { me.data = clone; });
        promise.finally(function() {
            me._data_rendered = 1;
            me.render_list();
        });
    }
    get_list_row_html(doc) {
        var html = super.get_list_row_html(doc);
        if (!$.isFunction(this.settings.set_row_background)) return html;
        var color = this.settings.set_row_background(doc);
        if (!color || Object.prototype.toString.call(color) !== '[object String]' || !color.length) return html;
        if (this._row_backgrounds.indexOf(color) >= 0) {
            html = html.replace(this._row_class, this._row_class + ' table-' + color);
        } else if (
            (color[0] === '#' && color.length >= 4)
            || color.substring(0, 3).toLowerCase() === 'rgb'
            || color.substring(0, 4).toLowerCase() === 'hsla'
        ) {
            html = html.replace(this._row_class, this._row_class + '" style="background-color:' + color);
        }
        return html;
    }
    _add_query_filter(args, field) {
        var qry = this._get_query_filter(field);
        if (qry && args.filters.indexOf(qry) < 0)
            args.filters.push(qry);
    }
    _get_query_filter(field) {
        var ret = [
            this.doctype, field, '=',
            this.settings.query_filters[field]
        ];
        if ($.isArray(ret[3])) {
            var cond = ret[3];
            if (cond.length < 2) return;
            if (cond.length > 2) ret[1] = cond.shift();
            ret[2] = cond[0];
            ret[3] = cond[1];
        }
        return ret;
    }
};