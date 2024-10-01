'use strict';
'require baseclass';
'require form';
'require fs';
'require rpc';
'require uci';
'require ui';

var rulesetdoc = 'data:text/html;base64,' + 'cmxzdHBsYWNlaG9sZGVy';

var sharktaikogif = 'data:image/gif;base64,' + 'c2hhcmstdGFpa28uZ2lm';

return baseclass.extend({
	rulesetdoc: rulesetdoc,
	sharktaikogif: sharktaikogif,

	monospacefonts: [
		'"Cascadia Code"',
		'"Cascadia Mono"',
		'Menlo',
		'Monaco',
		'Consolas',
		'"Liberation Mono"',
		'"Courier New"',
		'monospace'
	],

	dashrepos: [
		['metacubex/metacubexd', _('metacubexd')],
		['metacubex/yacd-meta', _('yacd-meta')],
		['metacubex/razord-meta', _('razord-meta')]
	],

	checkurls: [
		['https://www.baidu.com', _('Baidu')],
		['https://s1.music.126.net/style/favicon.ico', _('163Music')],
		['https://www.google.com/generate_204', _('Google')],
		['https://github.com', _('GitHub')],
		['https://www.youtube.com', _('YouTube')]
	],

	health_checkurls: [
		['https://cp.cloudflare.com'],
		['https://www.gstatic.com/generate_204']
	],

	ip_version: [
		['', _('Keep default')],
		['dual', _('Dual stack')],
		['ipv4', _('IPv4 only')],
		['ipv6', _('IPv6 only')],
		['ipv4-prefer', _('Prefer IPv4')],
		['ipv6-prefer', _('Prefer IPv6')]
	],

	load_balance_strategy: [
		['round-robin', _('Simple round-robin all nodes')],
		['consistent-hashing', _('Same TLD requests. Same node')],
		['sticky-sessions', _('sticky-sessions')]
	],

	preset_outbound: {
		full: [
			['DIRECT'],
			['REJECT'],
			['REJECT-DROP'],
			['PASS'],
			['COMPATIBLE']
		],
		direct: [
			['', _('null')],
			['DIRECT']
		],
		dns: [
			['', 'RULES'],
			['DIRECT']
		]
	},

	proxy_group_type: [
		['select', _('Select')],
		['fallback', _('Fallback')],
		['url-test', _('URL test')],
		['load-balance', _('Load balance')],
		//['relay', _('Relay')], // Deprecated
	],

	rules_type: [
		['DOMAIN'],
		['DOMAIN-SUFFIX'],
		['DOMAIN-KEYWORD'],
		['DOMAIN-REGEX'],
		['GEOSITE'],

		['IP-CIDR'],
		['IP-CIDR6'],
		['IP-SUFFIX'],
		//['IP-ASN'],
		['GEOIP'],

		['SRC-GEOIP'],
		//['SRC-IP-ASN'],
		['SRC-IP-CIDR'],
		['SRC-IP-SUFFIX'],

		['DST-PORT'],
		['SRC-PORT'],

		//['IN-PORT'],
		//['IN-TYPE'],
		//['IN-USER'],
		//['IN-NAME'],

		['PROCESS-PATH'],
		['PROCESS-PATH-REGEX'],
		['PROCESS-NAME'],
		['PROCESS-NAME-REGEX'],
		//['UID'],

		['NETWORK'],
		//['DSCP'],

		['RULE-SET'],
		['AND'],
		['OR'],
		['NOT'],
		['SUB-RULE'],

		//['MATCH']
	],

	tls_client_fingerprints: [
		'chrome',
		'firefox',
		'safari',
		'iOS',
		'android',
		'edge',
		'360',
		'qq',
		'random'
	],

	// thanks to homeproxy
	calcStringMD5: function(e) {
		/* Thanks to https://stackoverflow.com/a/41602636 */
		function h(a, b) {
			var c, d, e, f, g;
			e = a & 2147483648;
			f = b & 2147483648;
			c = a & 1073741824;
			d = b & 1073741824;
			g = (a & 1073741823) + (b & 1073741823);
			return c & d ? g ^ 2147483648 ^ e ^ f : c | d ? g & 1073741824 ? g ^ 3221225472 ^ e ^ f : g ^ 1073741824 ^ e ^ f : g ^ e ^ f;
		}
		function k(a, b, c, d, e, f, g) { a = h(a, h(h(b & c | ~b & d, e), g)); return h(a << f | a >>> 32 - f, b); }
		function l(a, b, c, d, e, f, g) { a = h(a, h(h(b & d | c & ~d, e), g)); return h(a << f | a >>> 32 - f, b); }
		function m(a, b, d, c, e, f, g) { a = h(a, h(h(b ^ d ^ c, e), g)); return h(a << f | a >>> 32 - f, b); }
		function n(a, b, d, c, e, f, g) { a = h(a, h(h(d ^ (b | ~c), e), g)); return h(a << f | a >>> 32 - f, b); }
		function p(a) {
			var b = '', d = '';
			for (var c = 0; 3 >= c; c++) d = a >>> 8 * c & 255, d = '0' + d.toString(16), b += d.substr(d.length - 2, 2);
			return b;
		}

		var f = [], q, r, s, t, a, b, c, d;
		e = function(a) {
			a = a.replace(/\r\n/g, '\n');
			for (var b = '', d = 0; d < a.length; d++) {
				var c = a.charCodeAt(d);
				128 > c ? b += String.fromCharCode(c) : (127 < c && 2048 > c ? b += String.fromCharCode(c >> 6 | 192) :
					(b += String.fromCharCode(c >> 12 | 224), b += String.fromCharCode(c >> 6 & 63 | 128)),
						b += String.fromCharCode(c & 63 | 128))
			}
			return b;
		}(e);
		f = function(b) {
			var c = b.length, a = c + 8;
			for (var d = 16 * ((a - a % 64) / 64 + 1), e = Array(d - 1), f = 0, g = 0; g < c;)
				a = (g - g % 4) / 4, f = g % 4 * 8, e[a] |= b.charCodeAt(g) << f, g++;
			a = (g - g % 4) / 4; e[a] |= 128 << g % 4 * 8; e[d - 2] = c << 3; e[d - 1] = c >>> 29;
			return e;
		}(e);
		a = 1732584193;
		b = 4023233417;
		c = 2562383102;
		d = 271733878;

		for (e = 0; e < f.length; e += 16) q = a, r = b, s = c, t = d,
			a = k(a, b, c, d, f[e +  0],  7, 3614090360), d = k(d, a, b, c, f[e +  1], 12, 3905402710),
			c = k(c, d, a, b, f[e +  2], 17,  606105819), b = k(b, c, d, a, f[e +  3], 22, 3250441966),
			a = k(a, b, c, d, f[e +  4], 7,  4118548399), d = k(d, a, b, c, f[e +  5], 12, 1200080426),
			c = k(c, d, a, b, f[e +  6], 17, 2821735955), b = k(b, c, d, a, f[e +  7], 22, 4249261313),
			a = k(a, b, c, d, f[e +  8],  7, 1770035416), d = k(d, a, b, c, f[e +  9], 12, 2336552879),
			c = k(c, d, a, b, f[e + 10], 17, 4294925233), b = k(b, c, d, a, f[e + 11], 22, 2304563134),
			a = k(a, b, c, d, f[e + 12],  7, 1804603682), d = k(d, a, b, c, f[e + 13], 12, 4254626195),
			c = k(c, d, a, b, f[e + 14], 17, 2792965006), b = k(b, c, d, a, f[e + 15], 22, 1236535329),
			a = l(a, b, c, d, f[e +  1],  5, 4129170786), d = l(d, a, b, c, f[e +  6],  9, 3225465664),
			c = l(c, d, a, b, f[e + 11], 14,  643717713), b = l(b, c, d, a, f[e +  0], 20, 3921069994),
			a = l(a, b, c, d, f[e +  5],  5, 3593408605), d = l(d, a, b, c, f[e + 10],  9,   38016083),
			c = l(c, d, a, b, f[e + 15], 14, 3634488961), b = l(b, c, d, a, f[e +  4], 20, 3889429448),
			a = l(a, b, c, d, f[e +  9],  5,  568446438), d = l(d, a, b, c, f[e + 14],  9, 3275163606),
			c = l(c, d, a, b, f[e +  3], 14, 4107603335), b = l(b, c, d, a, f[e +  8], 20, 1163531501),
			a = l(a, b, c, d, f[e + 13],  5, 2850285829), d = l(d, a, b, c, f[e +  2],  9, 4243563512),
			c = l(c, d, a, b, f[e +  7], 14, 1735328473), b = l(b, c, d, a, f[e + 12], 20, 2368359562),
			a = m(a, b, c, d, f[e +  5],  4, 4294588738), d = m(d, a, b, c, f[e +  8], 11, 2272392833),
			c = m(c, d, a, b, f[e + 11], 16, 1839030562), b = m(b, c, d, a, f[e + 14], 23, 4259657740),
			a = m(a, b, c, d, f[e +  1],  4, 2763975236), d = m(d, a, b, c, f[e +  4], 11, 1272893353),
			c = m(c, d, a, b, f[e +  7], 16, 4139469664), b = m(b, c, d, a, f[e + 10], 23, 3200236656),
			a = m(a, b, c, d, f[e + 13],  4,  681279174), d = m(d, a, b, c, f[e +  0], 11, 3936430074),
			c = m(c, d, a, b, f[e +  3], 16, 3572445317), b = m(b, c, d, a, f[e +  6], 23,   76029189),
			a = m(a, b, c, d, f[e +  9],  4, 3654602809), d = m(d, a, b, c, f[e + 12], 11, 3873151461),
			c = m(c, d, a, b, f[e + 15], 16,  530742520), b = m(b, c, d, a, f[e +  2], 23, 3299628645),
			a = n(a, b, c, d, f[e +  0],  6, 4096336452), d = n(d, a, b, c, f[e +  7], 10, 1126891415),
			c = n(c, d, a, b, f[e + 14], 15, 2878612391), b = n(b, c, d, a, f[e +  5], 21, 4237533241),
			a = n(a, b, c, d, f[e + 12],  6, 1700485571), d = n(d, a, b, c, f[e +  3], 10, 2399980690),
			c = n(c, d, a, b, f[e + 10], 15, 4293915773), b = n(b, c, d, a, f[e +  1], 21, 2240044497),
			a = n(a, b, c, d, f[e +  8],  6, 1873313359), d = n(d, a, b, c, f[e + 15], 10, 4264355552),
			c = n(c, d, a, b, f[e +  6], 15, 2734768916), b = n(b, c, d, a, f[e + 13], 21, 1309151649),
			a = n(a, b, c, d, f[e +  4],  6, 4149444226), d = n(d, a, b, c, f[e + 11], 10, 3174756917),
			c = n(c, d, a, b, f[e +  2], 15,  718787259), b = n(b, c, d, a, f[e +  9], 21, 3951481745),
			a = h(a, q), b = h(b, r), c = h(c, s), d = h(d, t);
		return (p(a) + p(b) + p(c) + p(d)).toLowerCase();
	},

	// thanks to homeproxy
	decodeBase64Str: function(str) {
		if (!str)
			return null;

		/* Thanks to luci-app-ssr-plus */
		str = str.replace(/-/g, '+').replace(/_/g, '/');
		var padding = (4 - str.length % 4) % 4;
		if (padding)
			str = str + Array(padding + 1).join('=');

		return decodeURIComponent(Array.prototype.map.call(atob(str), (c) =>
			'%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
		).join(''));
	},

	getFeatures: function() {
		var callGetFeatures = rpc.declare({
			object: 'luci.fchomo',
			method: 'get_features',
			expect: { '': {} }
		});

		return L.resolveDefault(callGetFeatures(), {});
	},

	getServiceStatus: function(instance) {
		var conf = 'fchomo';
		var callServiceList = rpc.declare({
			object: 'service',
			method: 'list',
			params: ['name'],
			expect: { '': {} }
		});

		return L.resolveDefault(callServiceList(conf), {})
			.then((res) => {
				var isRunning = false;
				try {
					isRunning = res[conf]['instances'][instance].running;
				} catch (e) {}
				return isRunning;
			});
	},

	getClashAPI: function(instance) {
		var callGetClashAPI = rpc.declare({
			object: 'luci.fchomo',
			method: 'get_clash_api',
			params: ['instance'],
			expect: { '': {} }
		});

		return L.resolveDefault(callGetClashAPI(instance), {});
	},

	// thanks to homeproxy
	loadDefaultLabel: function(uciconfig, ucisection) {
		var label = uci.get(uciconfig, ucisection, 'label');
		if (label) {
			return label;
		} else {
			uci.set(uciconfig, ucisection, 'label', ucisection);
			return ucisection;
		}
	},

	// thanks to homeproxy
	loadModalTitle: function(title, addtitle, uciconfig, ucisection) {
		var label = uci.get(uciconfig, ucisection, 'label');
		return label ? title + ' » ' + label : addtitle;
	},

	loadProxyGroupLabel: function(preadds, uciconfig, ucisection) {
		delete this.keylist;
		delete this.vallist;

		preadds?.forEach((arr) => {
			this.value.apply(this, arr);
		});
		uci.sections(uciconfig, 'proxy_group', (res) => {
			if (res.enabled !== '0')
				this.value(res['.name'], res.label);
		});

		return this.super('load', ucisection);
	},

	loadProviderLabel: function(uciconfig, ucisection) {
		delete this.keylist;
		delete this.vallist;

		this.value('', _('-- Please choose --'));
		uci.sections(uciconfig, 'provider', (res) => {
			if (res.enabled !== '0')
				this.value(res['.name'], res.label);
		});

		return this.super('load', ucisection);
	},

	loadRulesetLabel: function(behaviors, uciconfig, ucisection) {
		delete this.keylist;
		delete this.vallist;

		this.value('', _('-- Please choose --'));
		uci.sections(uciconfig, 'ruleset', (res) => {
			if (res.enabled !== '0')
				if (behaviors ? behaviors.includes(res.behavior) : true)
					this.value(res['.name'], res.label);
		});

		return this.super('load', ucisection);
	},

	renderStatus: function(self, ElId, isRunning, instance, noGlobal) {
		var visible = isRunning && (isRunning.http || isRunning.https);

		return E([
			E('button', {
				'class': 'cbi-button cbi-button-apply' + (noGlobal ? ' hidden' : ''),
				'click': ui.createHandlerFn(this, self.handleReload, instance)
			}, [ _('Reload') ]),
			self.updateStatus(self, E('span', { id: ElId, style: 'border: unset; font-style: italic; font-weight: bold' }), isRunning ? true : false),
			E('a', {
				'class': 'cbi-button cbi-button-apply %s'.format(visible ? '' : 'hidden'),
				'href': !visible ? '' : 'http%s://%s:%s/'.format(isRunning.https ? 's' : '',
						window.location.hostname,
						isRunning.https ? isRunning.https.split(':').pop() : isRunning.http.split(':').pop()),
				'target': '_blank',
				'rel': 'noreferrer noopener'
			}, [ _('Open Dashboard') ])
		]);
	},
	updateStatus: function(self, El, isRunning, instance, noGlobal) {
		if (El) {
			El.style.color = isRunning ? 'green' : 'red';
			El.innerHTML = '&ensp;%s%s&ensp;'.format(noGlobal ? instance + ' ' : '', isRunning ? _('Running') : _('Not Running'));
			/* Dashboard button */
			if (El.nextSibling?.localName === 'a')
				self.getClashAPI(instance).then((res) => {
					let visible = isRunning && (res.http || res.https);
					if (visible) {
						El.nextSibling.classList.remove('hidden');
					} else
						El.nextSibling.classList.add('hidden');
					if (visible)
						El.nextSibling.href = 'http%s://%s:%s/'.format(res.https ? 's' : '',
							window.location.hostname,
							res.https ? res.https.split(':').pop() : res.http.split(':').pop());
				});
		}

		return El;
	},

	renderResDownload: function(self, restype, uciconfig, ucisection) {
		var type = uci.get(uciconfig, ucisection, 'type'),
			url = uci.get(uciconfig, ucisection, 'url');

		var El = E([
			E('button', {
				class: 'cbi-button cbi-button-apply',
				disabled: (type !== 'http') || null,
				click: ui.createHandlerFn(this, function(ucisection, type, url) {
					if (type === 'http') {
						return self.downloadFile(restype, ucisection, url).then((res) => {
							ui.addNotification(null, E('p', _('Download successful.')));
						}).catch((e) => {
							ui.addNotification(null, E('p', _('Download failed: %s').format(e)));
						});
					} else
						return ui.addNotification(null, E('p', _('Unable to download unsupported type: %s').format(type)));
				}, ucisection, type, url)
			}, [ _('🡇') ]) //🗘
		]);

		return El;
	},

	renderSectionAdd: function(section, prefmt, LC, extra_class) {
		var el = form.GridSection.prototype.renderSectionAdd.apply(section, [ extra_class ]),
			nameEl = el.querySelector('.cbi-section-create-name');
		ui.addValidator(nameEl, 'uciname', true, (v) => {
			var button = el.querySelector('.cbi-section-create > .cbi-button-add');
			var uciconfig = section.uciconfig || section.map.config;
			var prefix = prefmt?.prefix ? prefmt.prefix : '',
				suffix = prefmt?.suffix ? prefmt.suffix : '';

			if (!v) {
				button.disabled = true;
				return true;
			} else if (LC && (v !== v.toLowerCase())) {
				button.disabled = true;
				return _('Expecting: %s').format(_('Lowercase only'));
			} else if (uci.get(uciconfig, v)) {
				button.disabled = true;
				return _('Expecting: %s').format(_('unique UCI identifier'));
			} else if (uci.get(uciconfig, prefix + v + suffix)) {
				button.disabled = true;
				return _('Expecting: %s').format(_('unique label'));
			} else {
				button.disabled = null;
				return true;
			}
		}, 'blur', 'keyup');

		return el;
	},

	handleAdd: function(section, prefmt, ev, name) {
		var prefix = prefmt?.prefix ? prefmt.prefix : '',
			suffix = prefmt?.suffix ? prefmt.suffix : '';

		return form.GridSection.prototype.handleAdd.apply(section, [ ev, prefix + name + suffix ]);
	},

	handleReload: function(instance, ev, section_id) {
		var instance = instance || '';
		return fs.exec('/etc/init.d/fchomo', ['reload', instance])
			.then((res) => { return window.location = window.location.href.split('#')[0] })
			.catch((e) => {
				ui.addNotification(null, E('p', _('Failed to execute "/etc/init.d/fchomo %s %s" reason: %s').format('reload', instance, e)))
			})
	},

	handleRemoveIdles: function(self, uciconfig, ucisection) {
		let loaded = [];
		uci.sections(uciconfig, ucisection, (section, sid) => loaded.push(sid));

		return self.lsDir(ucisection).then((res) => {
			let sectionEl = E('div', { class: 'cbi-section' }, []);

			res.filter(e => !loaded.includes(e)).forEach((filename) => {
				sectionEl.appendChild(E('div', { class: 'cbi-value' }, [
					E('label', {
						class: 'cbi-value-title',
						id: 'rmidles.' + filename + '.label'
					}, [ filename ]),
					E('div', { class: 'cbi-value-field' }, [
						E('button', {
							class: 'cbi-button cbi-button-negative important',
							id: 'rmidles.' + filename + '.button',
							click: ui.createHandlerFn(this, function(filename) {
								return self.removeFile(ucisection, filename).then((res) => {
									let node = document.getElementById('rmidles.' + filename + '.label');
									node.innerHTML = '<s>%s</s>'.format(node.innerHTML);
									node = document.getElementById('rmidles.' + filename + '.button');
									node.classList.add('hidden');
								});
							}, filename)
						}, [ _('Remove') ])
					])
				]));
			});

			ui.showModal(_('Remove idles'), [
				sectionEl,
				E('div', { class: 'right' }, [
					E('button', {
						class: 'btn cbi-button-action',
						click: ui.hideModal
					}, [ _('Complete') ])
				])
			]);
		});
	},

	validateTimeDuration: function(uciconfig, ucisection, ucioption, section_id, value) {
		if (!value)
			return true;

		if (!value.match(/^(\d+)(s|m|h|d)?$/))
			return _('Expecting: %s').format(_('/^(\\d+)(s|m|h|d)?$/'));

		return true;
	},

	validateJson: function(section_id, value) {
		if (!value)
			return true;

		try {
			var obj = JSON.parse(value.trim());
			if (!obj)
				return _('Expecting: %s').format(_('valid JSON format'));
		}
		catch(e) {
			return _('Expecting: %s').format(_('valid JSON format'));
		}

		return true;
	},

	// thanks to homeproxy
	validateUniqueValue: function(uciconfig, ucisection, ucioption, section_id, value) {
		if (section_id) {
			if (!value)
				return _('Expecting: %s').format(_('non-empty value'));

			var duplicate = false;
			uci.sections(uciconfig, ucisection, (res) => {
				if (res['.name'] !== section_id)
					if (res[ucioption] === value)
						duplicate = true
			});
			if (duplicate)
				return _('Expecting: %s').format(_('unique value'));
		}

		return true;
	},

	validateUrl: function(section_id, value) {
		if (!value)
			return true;

		try {
			var url = new URL(value);
			if (!url.hostname)
				return _('Expecting: %s').format(_('valid URL'));
		}
		catch(e) {
			return _('Expecting: %s').format(_('valid URL'));
		}

		return true;
	},

	lsDir: function(type) {
		var callLsDir = rpc.declare({
			object: 'luci.fchomo',
			method: 'dir_ls',
			params: ['type'],
			expect: { '': {} }
		});

		return L.resolveDefault(callLsDir(type), {}).then((res) => {
			if (res.result) {
				return res.result;
			} else
				throw res.error || 'unknown error';
		});
	},

	readFile: function(type, filename) {
		var callReadFile = rpc.declare({
			object: 'luci.fchomo',
			method: 'file_read',
			params: ['type', 'filename'],
			expect: { '': {} }
		});

		return L.resolveDefault(callReadFile(type, filename), {}).then((res) => {
			if (res.content ?? true) {
				return res.content;
			} else
				throw res.error || 'unknown error';
		});
	},

	writeFile: function(type, filename, content) {
		var callWriteFile = rpc.declare({
			object: 'luci.fchomo',
			method: 'file_write',
			params: ['type', 'filename', 'content'],
			expect: { '': {} }
		});

		return L.resolveDefault(callWriteFile(type, filename, content), {}).then((res) => {
			if (res.result) {
				return res.result;
			} else
				throw res.error || 'unknown error';
		});
	},

	downloadFile: function(type, filename, url) {
		var callDownloadFile = rpc.declare({
			object: 'luci.fchomo',
			method: 'file_download',
			params: ['type', 'filename', 'url'],
			expect: { '': {} }
		});

		return L.resolveDefault(callDownloadFile(type, filename, url), {}).then((res) => {
			if (res.result) {
				return res.result;
			} else
				throw res.error || 'unknown error';
		});
	},

	removeFile: function(type, filename) {
		var callRemoveFile = rpc.declare({
			object: 'luci.fchomo',
			method: 'file_remove',
			params: ['type', 'filename'],
			expect: { '': {} }
		});

		return L.resolveDefault(callRemoveFile(type, filename), {}).then((res) => {
			if (res.result) {
				return res.result;
			} else
				throw res.error || 'unknown error';
		});
	}
});
