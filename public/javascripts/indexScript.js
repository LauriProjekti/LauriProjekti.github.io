"use strict";

var url = 'https://api.mlab.com/api/1/databases/local_library/collections/stats?apiKey=i0tCYutvccPPCzMneb1bq0xN2-GUdgZB';

var url2 = 'https://api.mlab.com/api/1/databases/local_library/collections/totalstats?apiKey=i0tCYutvccPPCzMneb1bq0xN2-GUdgZB';

//Vue
new Vue({
	el: '#app',
	created: function() {

		this.getScore();
		//this.getEmail();
	},

	data: {
		canvasWidth: 600,
		canvasHeight: 600,
		player: 1,
		mousePos: {
			x: 0,
			y: 0
		},
		rows: [],
		boardSize: 3,
		winner: 0,
		over: false,
		stats:[],
		totalstats:[],
		email: 'placeholder',
		twitterId: 'placeholder',
		facebookName: 'placeholder',
		message: "It's your turn"
	},

	watch: {
		over: function(newValue) {
			console.log(newValue);
		}
	},

	mounted() {
		//load tick-tack-toe grid
		this.initGame();

		// set the email value if user is logged in with local auth
		if (document.getElementById("email") != null) {
			this.email = document.getElementById("email").innerHTML;
		}

		// set the facebook name if user is logged in with facebook
		if (document.getElementById("facebook") != null) {
			this.facebookName = document.getElementById("facebook").innerHTML;
		}

		// don't you have a phone? hamburger menu.
		document.addEventListener('DOMContentLoaded', function() {
    		var elems = document.querySelectorAll('.sidenav');
    		var instances = M.Sidenav.init(elems);
  		});

		//detect where player clicks and where to place marker 
		var c = document.getElementById("myCanvas");
		var self = this;
		c.addEventListener('mouseup', function() {
			console.log(self.mousePos.x+','+self.mousePos.y)
			var drawPos = self.getDrawPos(self.mousePos.x, self.mousePos.y);
			if (self.rows[drawPos.x][drawPos.y] == 0) {
				if (self.player == 1) {
					self.drawCircle(drawPos);
					self.rows[drawPos.x][drawPos.y] = 1;
					//self.printMatrix(this.rows);
					// check if we can find a winner
					self.over = self.checkWinner(self.rows);

					// if over is true we end the game
					if (self.over) {
						self.gameOver("The winner is player "+self.player+"!");
						// player 1 won, add win to player
						self.addStat("win");
						self.oWin();
						self.getScore();
						self.message = "Comp turn."
						return;
					}

					// ok so game didn't end... check if the game is a draw
					self.over = self.checkDraw(self.rows);
					// same as before. if return value is true, game has ended in a draw
					if (self.over) {
						self.gameOver("The game ended in a draw.");
						self.addStat("draw");
						self.getScore();
						return;
					}
					self.player = 2; // pass turn
					// call ai player
					self.compTurn();
				}
				
			}
		})

		// update mouse position info
		c.addEventListener('mousemove', function(evt) {
			self.mousePos = self.getMousePos(c, evt);
			/*var message = 'Mouse position: '+ self.mousePos.x + ',' + self.mousePos.y;
			console.log(message);*/
		})
	},

	methods: {

		initGame: function(){
			var c = document.getElementById("myCanvas");
			var ctx = c.getContext("2d");

			//background
			ctx.fillStyle = "#424242";
			ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight);

			console.log("asd");

			//grid
			ctx.strokeStyle = "#757575";
			ctx.lineWidth = 8;
			//vertical lines
			ctx.beginPath();
			ctx.moveTo(this.canvasWidth/3, 0);
			ctx.lineTo(this.canvasWidth/3, this.canvasHeight);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(2*this.canvasWidth/3, 0);
			ctx.lineTo(2*this.canvasWidth/3, this.canvasHeight);
			ctx.closePath();
			ctx.stroke();

			//horizontal lines
			ctx.beginPath();
			ctx.moveTo(0, this.canvasHeight/3);
			ctx.lineTo(this.canvasWidth, this.canvasHeight/3);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(0, 2*this.canvasHeight/3);
			ctx.lineTo(this.canvasWidth, 2*this.canvasHeight/3);
			ctx.closePath();
			ctx.stroke();

			//array for game board values
			for (var i = 0; i < this.boardSize; i++) {
				this.rows[i] = new Array(0, 0, 0);
			}


		},

		oWin: function() {
			var url = 'https://api.mlab.com/api/1/databases/local_library/collections/totalstats?apiKey=i0tCYutvccPPCzMneb1bq0xN2-GUdgZB';
			// increment wins by 1
			this.totalstats[0].o_wins++;
			axios.put(url, {
				o_wins: this.totalstats[0].o_wins,
				x_wins: this.totalstats[0].x_wins
			})
			.then(res => {
				console.log(res);
			})
			.catch(error => {
				console.log(error);
			});
		},

		xWin: function() {
			var url = 'https://api.mlab.com/api/1/databases/local_library/collections/totalstats?apiKey=i0tCYutvccPPCzMneb1bq0xN2-GUdgZB';
			// increment wins by 1
			this.totalstats[0].x_wins++;
			axios.put(url, {
				o_wins: this.totalstats[0].o_wins,
				x_wins: this.totalstats[0].x_wins
			})
			.then(res => {
				console.log(res);
			})
			.catch(error => {
				console.log(error);
			});
		},

		drawCircle: function(drawPos){
			// at first let's log mouse pos
			console.log("circle!!");

			if (this.mousePos.x != 0 && this.mousePos.y != 0) {
				var c = document.getElementById("myCanvas");
				var ctx = c.getContext("2d");
				ctx.strokeStyle = "#d1c4e9";
				ctx.lineWidth = 12;
				ctx.beginPath();
				ctx.arc(drawPos.drawx, drawPos.drawy, 50, 0, 2*Math.PI);
				ctx.stroke();
			}
		},

		drawX: function(drawPos){
			var c = document.getElementById("myCanvas");
			var ctx = c.getContext("2d");
			ctx.strokeStyle = "#bbdefb";
			ctx.lineWidth = 12;
			ctx.beginPath();
			ctx.moveTo(drawPos.drawx-50, drawPos.drawy-50);
			ctx.lineTo(drawPos.drawx+50, drawPos.drawy+50);

			ctx.moveTo(drawPos.drawx+50, drawPos.drawy-50);
			ctx.lineTo(drawPos.drawx-50, drawPos.drawy+50);
			ctx.stroke();
		},

		getMousePos(canvas, evt) {
			var rect = canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
		},

		checkWinner: function(rows) {
		    // vertical + horizontal checks
		    for (var i = 0; i < rows.length; i++) {
		        if (rows[i][0] === rows[i][1] && rows[i][2] === rows[i][1] && rows[i][0] !== 0) {
		            console.log('Voittaja löytyi pystyriviltä!');
		            this.winner = rows[i][0];
		            return true;
		        }
		        if (rows[0][i] === rows[1][i] && rows[2][i] === rows[1][i] && rows[0][i] !== 0) {
		            console.log('Voittaja löytyi vaakariviltä!');
		            this.winner = rows[0][i];
		            return true;
		        }

		    }

		    // diagonal checks
		    if (rows[0][0] === rows[1][1] && rows[1][1] === rows[2][2] && rows[0][0] !== 0) {
		        console.log('Voittaja löytyi vinolta riviltä!');
		        this.winner = rows[0][0];
		        return true;
		    }
		    if (rows[0][2] === rows[1][1] && rows[1][1] === rows[2][0] && rows[0][2] !== 0) {
		        console.log('Voittaja löytyi vinolta riviltä!');
		        this.winner = rows[0][2];
		        return true;
		    }

		    return false;
		},

		// this is a function for checking if the game ended in a draw
		checkDraw: function(rows) {
			// we check for draws by iterating rows matrix, if we can find 0, the game is still going, if not, it's a draw.
			for (var i = 0; i < rows.length; i++) {
				for (var j = 0; j < rows.length; j++) {
					if (rows[i][j] == 0) {
						return false;
					}
				}
			}
			return true;
		},

		printMatrix(rows) {
		    console.log('------------');
		    for (var i = 0; i < this.rows.length; i++) {
		        var line = '';
		        for (var j = 0; j < this.rows.length; j++) {
		            line = line + this.rows[j][i] + ' ';
		        }
		        console.log(line);
		    }
		    console.log('------------');
		},

		gameOver: function(winText) {
			var c = document.getElementById("myCanvas");
			var ctx = c.getContext("2d");

			//fill background for win canvas
			ctx.fillStyle = "#6200ea";
			ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight);

			ctx.fillStyle = "#ffffff";
			ctx.font = "40px Georgia";
			ctx.fillText(winText, 100, 300);
		},

		// gets the stats collection data
		getScore: function() {
			axios.get(url)
				.then(res => {
					this.stats = res.data;
				})
				.catch(error => {
					console.log(error);
				})
				.then(function() {

				});

			//get totalstats
			axios.get(url2)
				.then(res => {
					this.totalstats = res.data;
				})
				.catch(error => {
					console.log(error);
				});
		},
		
		addStat: function(stat) {
			//get id of document to be updated
			//iterate through stats, if we find email that matches current email, get the id
			for (var i in this.stats) {
				if (this.stats[i].email == this.email) {
					var id = this.stats[i]._id.$oid
					var wins = this.stats[i].wins;
					var losses = this.stats[i].losses;
					var draws = this.stats[i].draws;

					// increment by 1
					switch(stat) {
						case "win":
							wins++;
							break;
						case "loss":
							losses++;
							break;
						case "draw":
							draws++;
							break;
					}
					
					// make a put request with axios
					var url = 'https://api.mlab.com/api/1/databases/local_library/collections/stats/'+id+'?apiKey=i0tCYutvccPPCzMneb1bq0xN2-GUdgZB';
					axios.put(url, {
						email: this.email,
						wins: wins,
						losses: losses,
						draws: draws
					})
					.then(res => {
						console.log(res);
					})
					.catch(error => {
						console.log(error);
					});
				}

				if (this.stats[i].facebook == this.facebookName) {
					var id = this.stats[i]._id.$oid
					var wins = this.stats[i].wins;
					var losses = this.stats[i].losses;
					var draws = this.stats[i].draws;
					var name = this.stats[i].facebook;
					// increment by 1
					switch(stat) {
						case "win":
							wins++;
							break;
						case "loss":
							losses++;
							break;
						case "draw":
							draws++;
							break;
					}
					
					// make a put request with axios
					var url = 'https://api.mlab.com/api/1/databases/local_library/collections/stats/'+id+'?apiKey=i0tCYutvccPPCzMneb1bq0xN2-GUdgZB';
					axios.put(url, {
						facebook: name,
						wins: wins,
						losses: losses,
						draws: draws
					})
					.then(res => {
						console.log(res);
					})
					.catch(error => {
						console.log(error);
					});
				}
			}
		},

		compTurn: function() {
			var moveDone = false;

			while (!moveDone) {
				//get position for move. position is a random integer between 0 and canvawidth or height
				var x = Math.floor(Math.random() * this.canvasWidth);
				var y = Math.floor(Math.random() * this.canvasHeight);

				console.log('x:'+x+', y:'+y);

				// call getDrawPos with our x and y values
				// if matching return values in rows are ok, allow to make a move
				var drawPos = this.getDrawPos(x, y);
				if (this.rows[drawPos.x][drawPos.y] == 0) {
					// we are allowed to make a move
					this.drawX(drawPos);
					this.rows[drawPos.x][drawPos.y] = 2;
					moveDone = true;
					this.message = "It's your turn.";
				}

			}
			this.over = this.checkWinner(this.rows);
			if (this.over) {
				this.gameOver("The winner is player "+this.player+"!");
				// comp won, add loss to player
				this.addStat("loss");
				this.xWin();
				this.getScore();
				return;
			}
			// ok so game didn't end... check if the game is a draw
			this.over = this.checkDraw(this.rows);
			// if over is true, game has ended in a draw
			if (this.over) {
				this.gameOver("The game ended in a draw.");
				this.addStat("draw");
				this.getScore();
				return;
			}
			// pass turn back to player 1
			this.player = 1;
		},

		getDrawPos: function(x, y) {
			if (!this.over) {
				for (var i = 0; i < 3; i++) {
					for (var j = 0; j < 3; j++) {
						// iterate through grid values (3x3 grid) and match canvas location to mouse position
						if (x >= i*(this.canvasWidth/3) && x < (i+1)*(this.canvasWidth/3)) {
							if (y >= j*(this.canvasHeight/3) && y < (j+1)*(this.canvasHeight/3)) {
								var drawPos = {
									drawx: i*(this.canvasWidth/3) + (this.canvasWidth/3)/2,
									drawy: j*(this.canvasHeight/3) + (this.canvasHeight/3)/2,
									x: i,
									y: j
								};
								return drawPos;
							}
						}
					}
				}
			}
		},

	}
})