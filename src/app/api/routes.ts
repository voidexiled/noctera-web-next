export const API_ROUTES = {
	accounts: {
		_: "/api/accounts", // ! unused, need to review
		players: {
			_: "/api/accounts/players", // ? need to review
			id: (id: string | number) => `/api/accounts/players/${id}`, // ? need to review
			accountData: {
				_: "/api/accounts/players/account-data", // ! unused, need to remove it?
			},
			socialMedia: {
				_: "/api/accounts/players/social-media", // ! unused, need to remove it?
			},
		},
		twoFactor: {
			totp: {
				disable: {
					_: "/api/accounts/two-factor/totp/disable", // ? need to review
				},
				enable: {
					_: "/api/accounts/two-factor/totp/enable", // ? need to review
				},
				setup: {
					_: "/api/accounts/two-factor/totp/setup", // ? need to review
				},
			},
		},
		update: {
			email: {
				_: "/api/accounts/update/email", // ? need to review
			},
			registerKey: {
				_: "/api/accounts/update/register-key", // ! unused, need to remove it?
			},
		},
	},
	auth: {
		nextauth: {
			_: "/api/auth/[...nextauth]", // used but, how is used?, i dnt know how it works
		},
		activeEmail: {
			_: "/api/auth/active-email", // ? need to review
		},
		login: {
			_: "/api/auth/login", // ? need to review
		},
		manager: {
			account: {
				email: {
					_: "/api/auth/manager/account/email", // ! unused, need to remove it?
				},
				informationData: {
					_: "/api/auth/manager/account/information-data", // ! unused, need to remove it?
				},
				password: {
					_: "/api/auth/manager/account/password", // ? need to review, need to change nodemailer to react-email and resend
				},
				registerKey: {
					_: "/api/auth/manager/account/register-key", // ! unused, need to remove it?
				},
				socialMidiaData: {
					_: "/api/auth/manager/account/social-midia-data", // ! unused, need to remove it?
				},
			},
			player: {
				_: "/api/auth/manager/player", // ! unused, need to remove it?
				id: (id: string | number) => `/api/auth/manager/player/${id}`, // ! unused, need to remove it?
			},
		},
		recoveryPassword: {
			_: "/api/auth/recovery-password", // ? need to review
		},
		register: {
			_: "/api/auth/register", // ? need to review
		},
		resetPassword: {
			_: "/api/auth/reset-password", // ? need to review
		},
	},
	characters: {
		_: "/api/characters", // ! unused, need to remove it?
		name: (name: string) => `/api/characters/${name}`, // ? need to review
	},
	guilds: {
		_: "/api/guilds", // ! unused, need to remove it?
		name: (name: string) => `/api/guilds/${name}`, // ! unused, need to remove it?
		characters: {
			name: (name: string) => `/api/guilds/characters/${name}`, // ? need to review. used but its ok?
		},
		images: {
			filename: (filename: string) => `/api/guilds/images/${filename}`, // ? need to review
		},
		invitations: {
			_: "/api/guilds/invites/delete", // ? need to review
		},
		manager: {
			_: "/api/guilds/manager", // ? need to review the post(create guild), get unused, need to remove it?(fetch all guilds)
			id: (id: string | number) => ({
				// only DELETE is used, need to remove the others?
				_: `/api/guilds/manager/${id}`, // only DELETE is used, need to remove the others?
				join: {
					playerId: (playerId: string | number) => `/api/guilds/manager/${id}/join/${playerId}`, // ? need to review
				},
				kick: {
					playerId: (playerId: string | number) => `/api/guilds/manager/${id}/kick/${playerId}`, // delete need to review, put unused, need to remove it?
				},
				player: {
					_: `/api/guilds/manager/${id}/player`, // ! unused, need to remove it?
					playerId: (playerId: string | number) => `/api/guilds/manager/${id}/player/${playerId}`, // need to review all
				},
				ranks: {
					_: `/api/guilds/manager/${id}/ranks`, // Delete is unused, need to delete it?. all the others need to review
					rankId: (rankId: string | number) => `/api/guilds/manager/${id}/ranks/${rankId}`, // ? need to review
				},
			}),
			players: {
				accountId: (accountId: string | number) => `/api/guilds/manager/players/${accountId}`, // ! unused, need to remove it?, not useful?
			},
		},
	},
	news: {
		_: "/api/news", // ! unused, need to remove it?
		type: (type: string) => `/api/news/${type}`, // ? need to review
	},
	outfit: {
		_: "/api/outfit", // ? need to review por que necesito que solo pueda ser fetcheada desde la misma pagina, para que no se use desde otro lado o desde terminal, etc
	},
	send: {
		_: "/api/send", // ? need to review
	},
	status: {
		_: "/api/status", // ? need to review
	},
	shop: {
		categories: {
			_: "/api/shop/categories", // ! unused, need to remove it?
			id: (id: string | number) => `/api/shop/categories/${id}`, // ! unused, need to remove it?, wrong code
		},
		orders: {
			updateStatus: {
				_: "/api/shop/orders/update_status", // ? need to review
			},
		},
		product: {
			_: "/api/shop/product", // ! unused, need to remove it?, wrong code
			category: (category: string) => `/api/shop/product/${category}`, // ! unused, need to remove it?
		},
		stripe: {
			paymentIntents: {
				create: {
					_: "/api/shop/stripe/paymentIntents/create", // ? need to review
				},
				get: {
					_: "/api/shop/stripe/paymentIntents/get", // ! unused, need to remove it?, need to review
				},
			},
		},
	},
	battlepass: {
		account: {
			_: "/api/battlepass/account", // ? need to review
		},
		character: {
			_: "/api/battlepass/character", // ? need to review
		},
		player: {
			rewards: {
				create: {
					_: "/api/battlepass/player/rewards/create", // ? need to review
				},
			},
		},
		rewards: {
			_: "/api/battlepass/rewards/", // ? need to review, i think this should be in the admin api
			create: {
				_: "/api/battlepass/rewards/create", // ? need to review, i think this should be in the admin api
			},
			update: {
				_: "/api/battlepass/rewards/update", // ? need to review, i think this should be in the admin api
			},
		},
		season: {
			current: {
				_: "/api/battlepass/season/current", // ? need to review
			},
			delete: {
				_: "/api/battlepass/season/delete", // ? need to review, i think this should be in the admin api
			},
			new: {
				_: "/api/battlepass/season/new", // ? need to review, i think this should be in the admin api
			},
			update: {
				_: "/api/battlepass/season/update", // ? need to review, i think this should be in the admin api
			},
		},
		seasons: {
			_: "/api/battlepass/seasons", // ? need to review, i think this should be in the admin api
			rewards: {
				_: "/api/battlepass/seasons/rewards", // ? need to review, unused, need to remove it?
			},
			tasks: {
				_: "/api/battlepass/seasons/tasks", // ! unused, need to review, i think this should be in the admin api
			},
		},
	},
	administration: {
		accounts: {
			_: "/api/administration/accounts", // ? need to review
			addCoins: {
				id: (id: string | number) => `/api/administration/accounts/add-coins/${id}`, // ? need to review, should exist?
			},
			addPremdays: {
				id: (id: string | number) => `/api/administration/accounts/add-premdays/${id}`, // ? need to review, should exist?
			},
			delete: {
				id: (id: string | number) => `/api/administration/accounts/delete/${id}`, // ? need to review, unused
			},
		},
		blog: {
			_: "/api/administration/blog", // ? need to review, put unused
		},
		currency: {
			update: {
				_: "/api/administration/currency/update",
			},
		},
		players: {
			_: "/api/administration/players", // ? need to review
		},
		shop: {
			_: "/api/administration/shop", // ! unused, need to review
			products: {
				_: "/api/administration/shop/products", // ? need to review
				id: (id: string | number) => `/api/administration/shop/products/${id}`, // get unused, need to review the other ones
			},
		},
	},
};
