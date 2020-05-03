# Blackjack

# Running with Express

-   server: `npm start`

# REST API

All responses have:

-   a JSON body
-   a "success" boolean property that is either "true" or "false"
-   if "success" if false, there is an "error" property with a string message

If the request is a POST, then the request body is JSON.

The REST API commands follow.

## login

Allows players to login to the game, where they can view tables and join a
game.

**Request Format**

-   Method: `POST`
-   URI path: `/api/auth/login`

**JSON Request Body**

```JSON
{
  "playerName": "pradeep",
  "phoneNumber":"921111111"
 }
```

-   **playername** - the name you want to play as.

**JSON Response**

```JSON
{
    "success": true,
    "player": {
        "_id": "5eac273b1a7a0f032fc3219b",
        "phoneNumber": "921111111",
        "playerName": "pradeep",
        "created_date": "2020-05-01T13:42:19.862Z",
        "updated_date": "2020-05-01T13:42:19.862Z"
    }
}
```

## viewTables

Allows players to see the tables and who is at each table.

**Request Format**

-   Method: `GET`
-   URI path: `/api/table/viewTables`

**JSON Response**

```JSON
{
    "success": true,
    "tables": [
        {
            "_id": "5eae51ffda6ba5270f947814",
            "table_number": 1,
            "dealer_name": "Ashish",
            "intial_coin": 40,
            "game_start": false,
            "joined_players": [],
            "numPlayers": 0,
            "state":0,
            "players": {}
        }
    ]
}
```

-   **tables** - an array of all the tables where the key is the table id and the
      data describes the table
    -   **joined_players** - array of the players at the table
    -   **state** - game state for the table

## joinTable

**Request Format**

-   Method: `POST`
-   URI path: `/api/table/joinTable`

**JSON Request Body**

```JSON
{
	"tableId":"5eae51ffda6ba5270f947814",
  "playerId":"5eac273b1a7a0f032fc3219b"
}
```

-   **playerId** - the player id received on login
-   **tableId** - the table id received on viewTables

**JSON Response**

```JSON
{
    "success": true,
    "table": {
        "_id": "5eae51ffda6ba5270f947814",
        "table_number": 1,
        "dealer_name": "Ashish",
        "intial_coin": 40,
        "game_start": false,
        "joined_players": [
            "5eac273b1a7a0f032fc3219b"
        ],
        "numPlayers": 1,
        "players": {
            "5eac273b1a7a0f032fc3219b": {
                "playerName": "pradeep",
                "bet": -1,
                "hand": [],
                "done": false
            }
        }
    }
}
```

## bet
Connect with socket url `ws//localhost:8080`

**Request Format**

-   Event: `bet`

**JSON Request Body**

```JSON
{
  "tableId": "5eac69167a2a09d67432ff1e",
  "playerId": "5eac273b1a7a0f032fc3219b",
  "command": "bet",
  "bet": 50
}
```

-   **tableId** - table id with you joined
-   **playerId** - player id with you joined
-   **command** - event name
-   **bet** - amount of currency to bet on the next hand

**Event watcher for bet Response**
`socket.on('{tableId}',callback)`

**JSON Response**
```JSON
{
  "gameId": "5eadb72c535a801cc961f602",
  "tableId": "5eac69167a2a09d67432ff1e",
  "state": 2,
  "dealersHand": [{
    "suit": "clubs",
    "rank": "5",
    "value": 5
  }, {
    "suit": "spades",
    "rank": "7",
    "value": 7
  }],
  "maxSize": 0,
  "players": {
    "5eac273b1a7a0f032fc3219b": {
      "playerName": "pradeep",
      "bet": 50,
      "hand": [{
        "suit": "clubs",
        "rank": "7",
        "value": 7
      }, {
        "suit": "spades",
        "rank": "Queen",
        "value": 10
      }],
      "done": false,
      "openingMove": true,
      "score": 20,
      "busted": false,
      "win": false,
      "push": true
    }
  }
}
```
## hit

Informs the dealer to add another card to the player's hand. If the player
exceeds 21, the player loses the hand.

**Request Format**

-   Event: `bet`

**Event watcher for bet Response**
`socket.on('{tableId}',callback)`

**JSON Request Body**

```JSON

```
-   **tableId** - table id with you joined
-   **playerId** - player id with you joined
-   **command** - event name
-   **hand** - hand, upon which, to hit:
    -   1 - for default, if not specified, 1 is assumed
    -   2 - stand on the second hand only
    -   3 - stand on both hands

**JSON Reponse**

```JSON
{
  "gameId": "5eadb72c535a801cc961f602",
  "tableId": "5eac69167a2a09d67432ff1e",
  "state": 2,
  "dealersHand": [{
    "suit": "clubs",
    "rank": "5",
    "value": 5
  }, {
    "suit": "spades",
    "rank": "7",
    "value": 7
  }],
  "maxSize": 0,
  "table": {
    "_id": "5eac69167a2a09d67432ff1e",
    "table_number": 1,
    "dealer_name": "Pradeep",
    "intial_coin": 50,
    "game_start": false,
    "joined_players": ["5eac273b1a7a0f032fc3219b"],
    "numPlayers": 1
  },
  "players": {
    "5eac273b1a7a0f032fc3219b": {
      "playerName": "pradeep",
      "bet": 50,
      "hand": [{
        "suit": "clubs",
        "rank": "7",
        "value": 7
      }, {
        "suit": "spades",
        "rank": "Queen",
        "value": 10
      }, {
        "suit": "diamonds",
        "rank": "Ace",
        "value": [1, 10]
      }],
      "done": false,
      "openingMove": true,
      "score": 20,
      "busted": false,
      "win": false,
      "push": true
    }
  }
}
```

# **Unit Tests**

There should be more. Time was short on this project, and I felt having the user
tests, where users were simulated was more important for finding bugs. Still, if
I had more time, I would make additional unit tests around the following areas:

-   player object
-   login
-   table object

To run these tests, do the following:

-   cd to the root of the project, where the package.json resides
-   run `npm test`
