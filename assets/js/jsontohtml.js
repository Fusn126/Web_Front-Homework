var json2html = {
	transform: function(t, e, n) {
		var i = {
				events: [],
				html: ""
			},
			r = {
				events: !1
			};
		if (r = json2html._extend(r, n), void 0 !== e || void 0 !== t) {
			var s = "string" == typeof t ? JSON.parse(t) : t;
			i = json2html._transform(s, e, r)
		}
		return r.events ? i : i.html
	},
	_extend: function(t, e) {
		var n = {};
		for (var i in t) n[i] = t[i];
		for (var i in e) n[i] = e[i];
		return n
	},
	_append: function(t, e) {
		var n = {
			html: "",
			event: []
		};
		return void 0 !== t && void 0 !== e && (n.html = t.html + e.html, n.events = t.events.concat(e.events)), n
	},
	_isArray: function(t) {
		return "[object Array]" === Object.prototype.toString.call(t)
	},
	_transform: function(t, e, n) {
		var i = {
			events: [],
			html: ""
		};
		if (json2html._isArray(t))
			for (var r = t.length, s = 0; s < r; ++s) i = json2html._append(i, json2html._apply(t[s], e, s, n));
		else "object" == typeof t && (i = json2html._append(i, json2html._apply(t, e, void 0, n)));
		return i
	},
	_apply: function(t, e, n, i) {
		var r = {
			events: [],
			html: ""
		};
		if (json2html._isArray(e))
			for (var s = e.length, o = 0; o < s; ++o) r = json2html._append(r, json2html._apply(t, e[o], n, i));
		else if ("object" == typeof e) {
			var l = "<>";
			if (void 0 === e[l] && (l = "tag"), void 0 !== e[l]) {
				var a = json2html._getValue(t, e, l, n);
				r.html += "<" + a;
				var h, c = {
					events: [],
					html: ""
				};
				for (var f in e) switch (f) {
					case "tag":
					case "<>":
						break;
					case "text":
						var u = e[f];
						if (json2html._isArray(u));
						else if ("function" == typeof u) {
							var m = u.call(t, t, n);
							if (!json2html._isArray(m)) switch (typeof m) {
								case "function":
								case "undefined":
								case "object":
									break;
								default:
									c.html += json2html.toText(m)
							}
						} else h = json2html.toText(json2html._getValue(t, e, f, n));
						break;
					case "children":
					case "html":
						u = e[f];
						if (json2html._isArray(u)) c = json2html._append(c, json2html._apply(t, u, n, i));
						else if ("function" == typeof u) {
							m = u.call(t, t, n);
							if (!json2html._isArray(m)) switch (typeof m) {
								case "object":
									void 0 !== m.html && void 0 !== m.events && (c = json2html._append(c, m));
									break;
								case "function":
								case "undefined":
									break;
								default:
									c.html += m
							}
						} else h = json2html._getValue(t, e, f, n);
						break;
					default:
						var d = !1;
						if (f.length > 2 && "on" == f.substring(0, 2).toLowerCase()) {
							if (i.events) {
								var v = {
										action: e[f],
										obj: t,
										data: i.eventData,
										index: n
									},
									p = json2html._guid();
								r.events[r.events.length] = {
									id: p,
									type: f.substring(2),
									data: v
								}, r.html += " json2html-event-id-" + f.substring(2) + "='" + p + "'"
							}
							d = !0
						}
						if (!d) {
							var j, _ = json2html._getValue(t, e, f, n);
							if (void 0 !== _) j = "string" == typeof _ ? '"' + _.replace(/"/g, "&quot;") + '"' : _, r.html += " " + f +
								"=" + j
						}
				}
				r.html += ">", h && (r.html += h), (r = json2html._append(r, c)).html += "</" + a + ">"
			}
		}
		return r
	},
	_guid: function() {
		var t = function() {
			return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
		};
		return t() + t() + "-" + t() + t() + "-" + t() + t()
	},
	_getValue: function(t, e, n, i) {
		var r = e[n],
			s = typeof r;
		return "function" === s ? r.call(t, t, i) : "string" === s ? new json2html._tokenizer([/\$\{([^\}\{]+)\}/],
			function(e, n, i) {
				return n ? e.replace(i, function(e, n) {
					for (var i = n.split("."), r = t, s = "", o = i.length, l = 0; l < o; ++l) {
						if (i[l].length > 0)
							if (null === (r = r[i[l]]) || void 0 === r) break
					}
					return null !== r && void 0 !== r && (s = r), s
				}) : e
			}).parse(r).join("") : r
	},
	toText: function(t) {
		return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\'/g,
			"&#39;").replace(/\//g, "&#x2F;")
	},
	_tokenizer: function(t, e) {
		if (!(this instanceof json2html._tokenizer)) return new json2html._tokenizer(t, e);
		this.tokenizers = t.splice ? t : [t], e && (this.doBuild = e), this.parse = function(t) {
			this.src = t, this.ended = !1, this.tokens = [];
			do {
				this.next()
			} while (!this.ended);
			return this.tokens
		}, this.build = function(t, e) {
			t && this.tokens.push(this.doBuild ? this.doBuild(t, e, this.tkn) : t)
		}, this.next = function() {
			var t, e = this;
			e.findMin(), t = e.src.slice(0, e.min), e.build(t, !1), e.src = e.src.slice(e.min).replace(e.tkn, function(t) {
				return e.build(t, !0), ""
			}), e.src || (e.ended = !0)
		}, this.findMin = function() {
			var t, e, n = this,
				i = 0;
			for (n.min = -1, n.tkn = ""; void 0 !== (t = n.tokenizers[i++]);) - 1 != (e = n.src[t.test ? "search" : "indexOf"]
				(t)) && (-1 == n.min || e < n.min) && (n.tkn = t, n.min = e); - 1 == n.min && (n.min = n.src.length)
		}
	}
};
