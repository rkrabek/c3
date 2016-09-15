import { c3_chart_fn } from './index';

const load = function (args) {
    let $$ = this.internal, config = $$.config;
    // update xs if specified
    if (args.xs) {
        $$.addXs(args.xs);
    }
    // update names if exists
    if ('names' in args) {
        c3_chart_fn.data.names.bind(this)(args.names);
    }
    // update classes if exists
    if ('classes' in args) {
        Object.keys(args.classes).forEach((id) => {
            config.data_classes[id] = args.classes[id];
        });
    }
    // update categories if exists
    if ('categories' in args && $$.isCategorized()) {
        config.axis_x_categories = args.categories;
    }
    // update axes if exists
    if ('axes' in args) {
        Object.keys(args.axes).forEach((id) => {
            config.data_axes[id] = args.axes[id];
        });
    }
    // update colors if exists
    if ('colors' in args) {
        Object.keys(args.colors).forEach((id) => {
            config.data_colors[id] = args.colors[id];
        });
    }
    // use cache if exists
    if ('cacheIds' in args && $$.hasCaches(args.cacheIds)) {
        $$.load($$.getCaches(args.cacheIds), args.done);
        return;
    }
    // unload if needed
    if ('unload' in args) {
        // TODO: do not unload if target will load (included in url/rows/columns)
        $$.unload($$.mapToTargetIds((typeof args.unload === 'boolean' && args.unload) ? null : args.unload), () => {
            $$.loadFromArgs(args);
        });
    } else {
        $$.loadFromArgs(args);
    }
};

const unload = function (args) {
    const $$ = this.internal;
    args = args || {};
    if (args instanceof Array) {
        args = { ids: args };
    } else if (typeof args === 'string') {
        args = { ids: [args] };
    }
    $$.unload($$.mapToTargetIds(args.ids), () => {
        $$.redraw({ withUpdateOrgXDomain: true, withUpdateXDomain: true, withLegend: true });
        if (args.done) { args.done(); }
    });
};

export { load, unload };
