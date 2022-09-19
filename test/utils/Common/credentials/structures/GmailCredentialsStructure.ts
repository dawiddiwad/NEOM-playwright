export interface GmailCredentailsStructure {
    credentials: Credentials,
    token: Token
}

export interface Credentials {
    installed: {
        client_id: string,
        project_id: string,
        auth_uri: string,
        token_uri: string,
        auth_provider_x509_cert_url: string,
        client_secret: string,
        redirect_uris: [string, string]
    }
}

export interface Token {
    access_token: string,
    refresh_token: string,
    scope: string,
    token_type: string,
    expiry_date: number
}

//https://extendsclass.com/json-schema-validator.html
export const schema = {
	"title": "Root", 
	"type": "object",
	"required": [
		"credentials",
		"token"
	],
	"properties": {
		"credentials": {
			"$id": "#root/credentials", 
			"title": "Credentials", 
			"type": "object",
			"required": [
				"installed"
			],
			"properties": {
				"installed": {
					"$id": "#root/credentials/installed", 
					"title": "Installed", 
					"type": "object",
					"required": [
						"client_id",
						"project_id",
						"auth_uri",
						"token_uri",
						"auth_provider_x509_cert_url",
						"client_secret",
						"redirect_uris"
					],
					"properties": {
						"client_id": {
							"$id": "#root/credentials/installed/client_id", 
							"title": "Client_id", 
							"type": "string",
							"default": "",
							"pattern": "^.*$"
						},
						"project_id": {
							"$id": "#root/credentials/installed/project_id", 
							"title": "Project_id", 
							"type": "string",
							"default": "",
							"pattern": "^.*$"
						},
						"auth_uri": {
							"$id": "#root/credentials/installed/auth_uri", 
							"title": "Auth_uri", 
							"type": "string",
							"default": "",
							"pattern": "^.*$"
						},
						"token_uri": {
							"$id": "#root/credentials/installed/token_uri", 
							"title": "Token_uri", 
							"type": "string",
							"default": "",
							"pattern": "^.*$"
						},
						"auth_provider_x509_cert_url": {
							"$id": "#root/credentials/installed/auth_provider_x509_cert_url", 
							"title": "Auth_provider_x509_cert_url", 
							"type": "string",
							"default": "",
							"pattern": "^.*$"
						},
						"client_secret": {
							"$id": "#root/credentials/installed/client_secret", 
							"title": "Client_secret", 
							"type": "string",
							"default": "",
							"pattern": "^.*$"
						},
						"redirect_uris": {
							"$id": "#root/credentials/installed/redirect_uris", 
							"title": "Redirect_uris", 
							"type": "array",
							"default": [],
							"items":{
								"$id": "#root/credentials/installed/redirect_uris/items", 
								"title": "Items", 
								"type": "string",
								"default": "",
								"pattern": "^.*$"
							}
						}
					}
				}

			}
		}
,
		"token": {
			"$id": "#root/token", 
			"title": "Token", 
			"type": "object",
			"required": [
				"access_token",
				"refresh_token",
				"scope",
				"token_type",
				"expiry_date"
			],
			"properties": {
				"access_token": {
					"$id": "#root/token/access_token", 
					"title": "Access_token", 
					"type": "string",
					"default": "",
					"pattern": "^.*$"
				},
				"refresh_token": {
					"$id": "#root/token/refresh_token", 
					"title": "Refresh_token", 
					"type": "string",
					"default": "",
					"pattern": "^.*$"
				},
				"scope": {
					"$id": "#root/token/scope", 
					"title": "Scope", 
					"type": "string",
					"default": "",
					"pattern": "^.*$"
				},
				"token_type": {
					"$id": "#root/token/token_type", 
					"title": "Token_type", 
					"type": "string",
					"default": "",
					"pattern": "^.*$"
				},
				"expiry_date": {
					"$id": "#root/token/expiry_date", 
					"title": "Expiry_date", 
					"type": "integer",
					"default": 0
				}
			}
		}

	}
}
