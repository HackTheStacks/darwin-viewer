# Darwin Viewer

> View Darwin's notes! Match Darwin's notes! Basically - be Darwin.

## Install

```bash
git clone https://github.com/HackTheStacks/darwin-viewer
cd darwin-viewer
npm install
```

## Usage

```bash
npm start
```

## API

### `GET /api/fragments`

**Options:**
- `page`: Paginated data

**Response:**
- JSON

```json
[
	{
		"id": "1",
		"url": "/fragments/1/image",
	}
	...
]
```

### `GET /api/fragments/:id`

**Params:**
- `id`: Fragment id.

**Response:**
- JSON
- Matches where `baseId` is `id`
```json
{
	"id": "1",
	"text": "Text content...",
	"url": "/fragments/1/image",
	"matches": [
		{
            "id": 10,
			"baseId": 1,
            "targetId": 2,
			"edge": "S",
			"confidence": 0.9,
			"votes": 3
		}
		...
	]
}
```

### `GET /api/fragments/:id/image`

**Params:**
- `id`: Fragment id.

**Response:**
- Image File (jpg/png)

### `POST /api/matches`

**Body:**
- `baseId`: Id of main fragment.
- `targetId`: Second fragment matched against.
- `edge`: Relative to main fragment. (`N`, `S`, `E`, `W`)
- `confidence`: Number to indicate the confidence of the match.

```json
{
    "baseId": 2,
	"targetId": 1,
	"edge": "S",
	"confidence": 9,
    "votes": 10,
}
```

### `PUT /api/matches/:id/(upvote | downvote)`

**Params:**
- `id`: Id of a match to upvote / downvote
