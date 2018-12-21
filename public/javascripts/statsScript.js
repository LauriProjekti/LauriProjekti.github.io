"use strict";

//this is the url used for user stats
var url = 'https://api.mlab.com/api/1/databases/local_library/collections/stats?apiKey=i0tCYutvccPPCzMneb1bq0xN2-GUdgZB';

//this is the url used for total win/loss stats
var url2 = 'https://api.mlab.com/api/1/databases/local_library/collections/totalstats?apiKey=i0tCYutvccPPCzMneb1bq0xN2-GUdgZB';

//Vue
new Vue({
	el: '#app',
	created: function() {
		this.getScore();
	},

	data: {
		stats:[],
		totalstats:[{
			o_wins: 1,
			x_wins: 1
		}],
		email: 'placeholder',
		chart: {
			wins: 0,
			losses: 0,
			draws: 0,
		}
	},

	mounted() {
		document.addEventListener('DOMContentLoaded', function() {
    		var elems = document.querySelectorAll('.sidenav');
    		var instances = M.Sidenav.init(elems);
  		});
	},

	methods: {

		showInfo: function(info) {
			//change values given to chart
			var games = this.stats[info].wins + this.stats[info].losses + this.stats[info].draws;

			// user stats. we get the user info based on index of leaderboard list.
			this.chart.wins  = Math.round(((this.stats[info].wins/ games) * 100)*100)/100;
			this.chart.losses  = Math.round(((this.stats[info].losses/ games) * 100)*100)/100;
			this.chart.draws  = Math.round(((this.stats[info].draws/ games) * 100)*100)/100;

			this.initChart();
		},

		// gets the stats collection data
		getScore: function() {
			// get user data and save it in stats
			axios.get(url)
				.then(res => {
					res.data.sort(function (a, b) {
  						return b.wins - a.wins;
  					});
  					res.data = res.data.slice(0,10);
					this.stats = res.data;
					this.initChart();
				})
				.catch(error => {
					console.log(error);
				});

			// next get total win/loss data
			axios.get(url2)
				.then(res => {
					this.totalstats = res.data;
					this.initTotalChart();
				})
				.catch(error => {
					console.log(error);
				});
		},

		initChart: function() {
			var ctx = document.getElementById('chartContainer').getContext('2d');
			var chart = new Chart(ctx, {
				type: 'pie',
				data: {
					labels: [
						'wins',
						'losses',
						'draws'
					],

					datasets: [{
						data: [this.chart.wins, this.chart.losses, this.chart.draws],
						backgroundColor: [
							'rgba(126,87,194,1)',
							'rgba(209,196,233,1)',
							'rgba(224,64,251,1)'

						]
					}],
				},
				options: {
					title : {
						display: true,
						text: 'Player stats',
						fontSize: 16
					}
				}
			});
		},

		initTotalChart: function() {
			// init second chart
			var ctx = document.getElementById('chartContainer2').getContext('2d');
			var chart = new Chart(ctx, {
				type: 'pie',
				data: {
					labels: [
						'O wins',
						'X wins'
					],

					datasets: [{
						label: 'number of wins',
						data: [this.totalstats[0].o_wins, this.totalstats[0].x_wins],
						backgroundColor: [
							'rgba(126,87,194,1)',
							'rgba(209,196,233,1)'
						]
					}],
				},
				options: {
					title : {
						display: true,
						text: 'Win ratio of players and AI',
						fontSize: 16
					}
				}
			});
		}
	}
})