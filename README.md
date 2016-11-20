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

### `GET /some-endpoint/:a-param/view?an-option="a-value"`

**Params:**
- `a-param`: Some param.

**Options:**
- `an-option`: Some option.

**Response:**
- JSON
```json
{
	"id": 100
}
```

### `GET /api/fragments`

**Response:**
- JSON

```json
[
	{
		"id": "1",
		"url": "/fragments/1/image",
	}
]
```

### `GET /api/fragments/:id/image`

**Params:**
- `id`: Fragment id.

**Response:**
- Image File (jpg/png)

### `GET /api/fragments/:id`

**Params:**
- `id`: Fragment id.

**Response:**
- JSON
```json
{
	"id": "1",
	"text": "Text content...",
	"matches": [
		{
			"id": 2,
			"edge": "S",
			"confidence": 0.9,
			"votes": 3
		}
		...
	]
}
```
