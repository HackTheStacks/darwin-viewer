# Darwin Viewer

> View Darwin's notes! Match Darwin's notes! Basically - be Darwin.

## Install

```bash
git clone https://github.com/HackTheStacks/darwin-viewer
cd darwin-viewer
npm install
```

Possible other dependencies:

```bash
brew install sqlite3
npm install -g sqlite3
npm install -g sequelize
```

## Usage

```bash
sequelize db:migrate
sequelize db:seed:all
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

## What we need

The api pulls all of it's data from an `sqlite3` database. Some options for getting the datas into this database.

We don't need all the data. 20 images that have some relations would be totally fine for demo purposes.

#### 1) Populate an sqlite database yourself!

You can take a look at the files in `/migrations` to see the `sqlite3` schema. You would need a row for every slice picture (called `fragments`) and another row for all matches for a given fragment.

Might be annoying replicating a database though  ¯\\\_(ツ)\_/¯.

#### 2) Populate a `.csv` file!

Fill out a `.csv` file with whatever you want. Perhaps 2 files:
- 1 containing information about fragment files (`ids`, `filenames`)
- 1 containing relations for fragments (`baseFragmentId`, `targetFragmentId` ie. some id for a fragment that was compared to base, `confidence` score for how related they are, `edge` value describing which base edge the target likely lines up with)

We can then take these CSVs and write a script to populate our `sqlite3` database using this information.

#### 3) Provide a tool for comparing images!

Deliver some executable that can accept two images and compare them. We'll take some of the provided data, load it into our database and then call the executable to generate the matches. That should be fun!

#### 4) Create your own API!

I don't quite know why you would do that. But I heard it being spoken after a few bottles of Club-Mate, so I guess it's a thing that's been thought.
