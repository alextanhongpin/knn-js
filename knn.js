// Load data
// data is an array with the following model:
// [[5.1, 3.5, 1.4, 0.2, 'Iris-setosa'], [...]...]
const data = require('./iris-dataset.js');

// Format the data to the following
// [5.1, 3.5, 1.4, 0.2, 'Iris-setosa'] -> ['Iris-setosa', 5.1, 3.5, 1.4, 0.2]
function loadData(data) {
	return data.map((m) => {
		// 'Iris-setosa'
		const label = m.pop();
		return [label, m];
	});
}

// Split the dataset into training and testing set
// A split of .3 means 30% of the dataset will become the testing set
function splitDataset(dataset, split) {
	// [ trainingSet, testingSet ];
	return dataset.reduce((sets, item) => {

		if (Math.random() <= split) {
			// Testing set
			sets[1].push(item);
		} else {
			// Training set
			sets[0].push(item);
		}
		return sets;
	}, [[], []]);
}

// Euclidean distance me
// The higher the value, the more the similarity
// @param p1: An array of item with scores [1.0, 3.3, 2.2]
const euclideanDistance = (p1, p2) => {


	if (p1.length !== p2.length) {
		throw new Error('EuclideanDistanceError: Invalid length for p1 and p2');
	}
	const merged = p1.map((p, i) => {
		return [p, p2[i]];
	});

	const distanceSquared = merged.reduce((distance, points) => {
		return distance + Math.pow(points[0] - points[1], 2);
	}, 0);

	return 1 / (1 + distanceSquared);
};




// K-Nearest-Neighbour
// Get the closest k-neighbours from the dataset
function knn(trainingSet, testInstance, k) {



	const distanceFromNeighbours = trainingSet.reduce((distance, item) => {
		const neighbourLabel = item[0];
		const neighbourValues = item[1];
		const testInstanceValue = testInstance[1];
		distance.push([neighbourLabel, euclideanDistance(testInstanceValue, neighbourValues)]);
		return distance;
	}, []);


	const kNearestNeighbours = distanceFromNeighbours.sort((a, b) => {
		return b[1] - a[1];
	}).splice(0, [k]);

	return kNearestNeighbours;
}

// Vote the most likely matching item
function voteTop(neighbours) {
	if (!neighbours) return null;
	const results = neighbours.reduce((results, item) => {
		if (!results[item[0]]) results[item[0]] = 0;
		results[item[0]] += 1;
		return results;
	}, {});



	return Object.keys(results).map((m) => {
		return [m, results[m]];
	}).sort((a, b) => {
		return b[1] - a[1];
	})[0][0];
}


// The ratio of correct predictions over total predictions made
function computeAccuracy(results) {
	const correct = results.filter((data) => {
		return data;
	});
	return correct.length / results.length * 100;
}

function main() {

	const dataset = loadData(data);

	console.log(`Dataset with ${ dataset.length } items loaded successfully.`);
	const [ trainingSet, testingSet ] = splitDataset(dataset, 0.33);

	console.log(`Training set contains ${ trainingSet.length } data.`);
	console.log(`Testing set contains ${ testingSet.length } data.`);

	const KNN = 3;
	let predictions = [];
	testingSet.forEach((test) => {
		const neigbours = knn(trainingSet, test, KNN);
		const predicted = voteTop(neigbours);
		const expected = test[0];
		predictions.push(predicted === expected);
		console.log(`Predicted ${ predicted }, got ${ expected }.`)

	});

	const accuracy = computeAccuracy(predictions);
	console.log('Accuracy:', accuracy.toFixed(2) + '%');
}

main();