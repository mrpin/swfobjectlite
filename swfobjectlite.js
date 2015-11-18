var swfobjectlite = function ()
{
    var self = {};

    /*
     * Fields
     */

    /*
     * Methods
     */

    //private
    var console_log = function (message)
    {
        if (typeof(console) === 'undefined' || typeof(console['log']) === 'undefined')
        {
            return;
        }

        console.log(message);
    };

    //private
    var try_run_callback = function (callback, param)
    {
        if (callback == null)
        {
            return;
        }

        callback(param);
    };


    var get_flashvars_string = function (flashvars)
    {
        var result = [];

        for (var key in flashvars)
        {
            var value = flashvars[key];

            result.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        }

        return result.join("&");
    };

    //private
    var add_property = function (destination_name, destination, name, value)
    {
        if (value == null)
        {
            return;
        }

        if (destination[name] != null)
        {
            console_log("use param " + name + " with value " + value + " instead value from " + destination_name);
        }

        destination[name] = value;
    };

    //private
    var add_attribute = function (attributes, name, value)
    {
        add_property('attributes', attributes, name, value);
    };

    //private
    var add_param = function (params_obj, name, value)
    {
        add_property('params', params_obj, name, value);
    };

    //private
    var build_inner_html = function (params_obj)
    {
        var result = [];

        for (var key in params_obj)
        {
            result.push("<param name='" + key + "' value='" + params_obj[key] + "' />");
        }

        return result.join("\n");
    };

    //private
    var create_swf_tag = function (attributes, params_obj, swf_url, swf_version)
    {
        var params = [];

        var result = document.createElement("object");

        var browser_name = navigator.appName;

        if (browser_name.indexOf('Internet Explorer') != -1 || browser_name.indexOf('MSIE') != -1)
        {
            add_attribute(attributes, "classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
            add_attribute(attributes, "codebase", "http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#");
            add_attribute(attributes, "version", "9,0,0,0");

            add_param(params_obj, "movie", swf_url);
        }
        else
        {
            add_attribute(attributes, "type", 'application/x-shockwave-flash');
            add_attribute(attributes, "data", swf_url);

            add_param(params_obj, "stanby", "Launching Flash..");
        }

        add_param(params_obj, "SWLIVECONNECT", "true");

        for (var key in attributes)
        {
            result.setAttribute(key, attributes[key]);
        }

        result.innerHTML = build_inner_html(params_obj);

        return result;
    };

    //private
    var clone_obj = function (target)
    {
        if (target == null)
        {
            return null;
        }

        var result = {};

        for (var key in target)
        {
            result[key] = target[key];
        }

        return result;
    };

    //public
    self["embedSWF"] = function (swf_url, id, width, height, swf_version, not_used_express_install, flashvars, params_obj, attributes, callback)
    {
        attributes = clone_obj(attributes) || {};
        params_obj = clone_obj(params_obj) || {};
        swf_version = swf_version || '9,0,0,0';

        add_attribute(attributes, 'width', width);
        add_attribute(attributes, 'height', height);
        add_attribute(attributes, 'id', id);

        if (not_used_express_install != null)
        {
            console_log("express install url value will be ignored");
        }

        var tag_for_replace = document.getElementById(id);

        var callback_result = {};
        callback_result["id"] = id;

        if (tag_for_replace == null)
        {
            callback_result["success"] = false;

            console_log("can't found tag with id " + id);
            try_run_callback(callback, callback_result);
            return;
        }

        var flashvars_string = get_flashvars_string(flashvars);

        if (flashvars_string != null && flashvars_string.length > 0)
        {
            add_param(params_obj, "flashvars", flashvars_string);
        }

        var tag = create_swf_tag(attributes, params_obj, swf_url, swf_version);

        var parent = tag_for_replace.parentNode;

        parent.replaceChild(tag, tag_for_replace);

        callback_result["success"] = true;
        callback_result["ref"] = tag;

        try_run_callback(callback, callback_result);
    };

    return self;
}();
