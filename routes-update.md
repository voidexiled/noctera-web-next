# Existing API Routes

- api/accounts/ - _interact with account_ (PATCH) (unused, need to remove it?)
- api/accounts/players - _create player_ (POST) (need to review)
- api/accounts/players/[id] - _interact with specific player_ (DELETE, PATCH) (need to review)
- api/accounts/players/account-data - _create account-data data_ (POST) (unused, need to remove it?)
- api/accounts/players/social-media - _create social-media data_ (POST) (unused, need to remove it?)

- api/accounts/two-factor/totp/disable - _disable two factor_ (POST) (need to review)
- api/accounts/two-factor/totp/enable - _enable two factor_ (POST) (need to review)
- api/accounts/two-factor/totp/setup - _setup to configure totp_ (POST) (need to review)

- api/accounts/update/email - _to change email account_ (PATCH) (need to review)
- api/accounts/update/register-key - _to generate "recovery key" for my acc_ (PATCH) (unused, need to remove it?)

- api/auth/[...nextauth] - _to handle nextAuth routes_ (GET, POST) (used but, how is used?, i dnt know how it works)
- api/auth/active-email - _to create email verify token and to use it_ (GET, POST) (need to review)
- api/auth/login - _to handle login by game client_ (POST) (need to review)

- api/auth/manager/account/email - _to update email?_ (PUT) (unused, need to remove it?)
- api/auth/manager/account/information-data - _to update account information_ (PUT) (unused, need to remove it?)
- api/auth/manager/account/password - _to update account password_ (PUT) (need to review, need to change nodemailer to react-email and resend)
- api/auth/manager/account/register-key - _to create new register-key_ (PUT) (unused, need to remove it?)
- api/auth/manager/account/social-midia-data - _to update social media account data_ (PUT) (unused, need to remove it?)

- api/auth/manager/player - _to create new account character_ (POST) (unused, need to remove it?)
- api/auth/manager/player/[id] - _to update character data_ (PUT) (unused, need to remove it?)

- api/auth/recovery-password - _to generate token to recovery password_ (POST) (need to review)
- api/auth/register - _to register a new account_ (POST) (need to review)
- api/auth/reset-password - _to reset password with a valid token to do it_ (POST) (need to review)

- api/characters - _to get characters by a couple of filters given_ (GET) (unused, need to remove it?)
- api/characters/[...name] - _to get a character by name_ (GET) (need to review)

- api/guilds - _to fetch guilds_ (GET) (unused, need to remove it?)
- api/guilds/[...name] - _to fetch guilds where name contains the name_ (GET) (unused, need to remove it?)
- api/guilds/characters/[...name] - _used to fetch characters that dont have guild and name contains name_ (GET) (need to review. used but its ok?)
- api/guilds/images/[filename] - _used to get guild image as a readable stream_ (GET) (need to review)
- api/guilds/invites/delete - _used to cancel guild invitations to invited players_ (DELETE) (need to review)
- api/guilds/manager - _used to create guild, and fetch all guilds_ (POST, GET) (need to review the post(create guild), get unused, need to remove it?(fetch all guilds))
- api/guilds/manager/[id] - _get guild, update guild, delete guild_ (GET, PUT, DELETE) (only DELETE is used, need to remove the others?)
- api/guilds/manager/[id]/join/[player_id] - _used by players to accept a guild invitation_ (PATCH) (need to review)
- api/guilds/manager/[id]/kick/[player_id] - _delete to kick players from guild, put to change rank_ (DELETE, PUT) (delete need to review, put unused, need to remove it?)
- api/guilds/manager/[id]/player - _to search players where name contains name_ (GET) (unused, need to remove it?)
- api/guilds/manager/[id]/player/[player_id] - _put to change rank, post to invite players, get to find search player in_ (PUT, POST, GET) (need to review all)
- api/guilds/manager/[id]/ranks - _get to list ranks, post to create rank, put to update rank, delete to del_ (GET, POST, PUT, DELETE) (Delete is unused, need to delete it?. all the others need to review)
- api/guilds/manager/[id]/ranks/[rank_id] - _to delete ranks_ (DELETE) (need to review)
- api/guilds/manager/players/[account_id] - _to list characters of an account by id_ (GET) (unused, need to remove it?, not useful?)

- api/news - _to list all post news_ (GET) (unused, need to remove it?)
- api/news/[type] - _to list news by type (roadmap post, news post, ticker post)_ (GET) (need to review)

- api/outfit - _to get a outfit image_ (GET) (need to review por que necesito que solo pueda ser fetcheada desde la misma pagina, para que no se use desde otro lado o desde terminal, etc)

- api/send - _to send email-confirmation email_ (POST) (need to review)

- api/status - _to get game server status (online or offline and players online count)_ (GET) (need to review)

- api/shop/categories - _to list shop product categories_ (GET) (unused, need to remove it?)
- api/shop/categories/[id] - _to fetch a category_ (GET) (unused, need to remove it?, wrong code)
- api/shop/orders/update_status - _to update a order status_ (POST) (need to review)
- api/shop/product - _to fetch all products_ (GET) (unused, need to remove it?, wrong code)
- api/shop/product/[category] - _to fetch products where category_ (GET) (unused, need to remove it?)
- api/shop/stripe/paymentIntents/create - _to create payment intent to stripe_ (POST) (need to review)
- api/shop/stripe/paymentIntents/get - _to fetch a payment intent from stripe_ (POST) (unused, need to remove it?, need to review)

- api/battlepass/account - _to fetch user account with all players and his battlepass progress_ (POST) (need to review)
- api/battlepass/character - _to fetch a character and his battlepass progress by id_ (POST) (need to review)
- api/battlepass/player/rewards/create - _to mark a reward as claimed for a character_ (POST) (need to review)
- api/battlepass/rewards/ - _to fetch all battlepass rewards_ (POST) (need to review, i think this should be in the admin api)
- api/battlepass/rewards/create - _to add a reward to a battlepass season_ (POST) (need to review, i think this should be in the admin api)
- api/battlepass/rewards/update - _to update a battlepass season reward_ (POST) (need to review, i think this should be in the admin api)

- api/battlepass/season/current - _to fetch current battlepass season data_ (POST) (need to review)
- api/battlepass/season/delete - _to delete a battlepass season_ (POST) (need to review, i think this should be in the admin api)
- api/battlepass/season/new - _to ceate a new battlepass season_ (POST) (need to review, i think this should be in the admin api)
- api/battlepass/season/update - _to update a battlepass season data_ (POST) (need to review, i think this should be in the admin api)

- api/battlepass/seasons - _to fetch all existents battlepass seasons_ (POST) (need to review, i think this should be in the admin api)
- api/battlepass/seasons/rewards - _to fetch all battlepass rewards, same as api/battlepass/rewards/_ (POST) (need to review, unused, need to remove it?)
- api/battlepass/seasons/tasks - _to fetch all battlepass tasks_ (POST) (unused, need to review, i think this should be in the admin api)

- api/administration/accounts - _to fetch list of accounts by a given name or email_ (GET) (need to review)
- api/administration/accounts/add-coins/[id] - _to give coins to a player_ (PUT) (need to review, should exist?)
- api/administration/accounts/add-premdays/[id] - _to give premium days to a player_ (PUT) (need to review, should exist?)
- api/administration/accounts/delete/[id] - _to delete a account_ (DELETE) (need to review, unused)
- api/administration/blog - _post to create post,put to update post,get to fetch post,delete to delete_ (POST,PUT,GET,DELETE) (need to review, put unused)
- api/administration/currency/update - _to update currencies table_ (POST) ()
- api/administration/players - _to fetch players with name, and email as filters_ (GET) (need to review)
- api/administration/shop - _to fetch products_ (GET) (unused, need to review)
- api/administration/shop/products - _to create a product_ (POST) (need to review)
- api/administration/shop/products/[id] - _GET to fetch product, PUT to update product, DELETE to delete product_ (GET, PUT, DELETE) (get unused, need to review the other ones)

# API Routes Recommendations from ChatGPT

# Reviewed API Routes

# Typed API Routes

# Battle Pass Routes to Transfer to Admin API Routes

- api/battlepass/rewards/*
- api/battlepass/seasons/*
- api/battlepass/season/delete/
- api/battlepass/season/new/
- api/battlepass/season/update/
