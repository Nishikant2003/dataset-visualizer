// Model for a Monthly Expenses, Weather Data, and Quiz Scores dataset
const DatasetModel = Backbone.Model.extend({
    defaults: {
        currentDataset: 'Monthly Expenses',
        datasets: {
            'Monthly Expenses': {
                
                caption: 'Monthly Expenses',
                headers: ['Month', 'Rent', 'Food', 'Transport', 'Utilities', 'Entertainment'],
                rows: [
                    ['Jan', 1200, 300, 100, 150, 200],
                    ['Feb', 1200, 310, 90, 140, 180],
                    ['Mar', 1000, 320, 110, 160, 190],
                    ['Apr', 1200, 315, 120, 150, 220],
                    ['May', 1200, 325, 100, 155, 210],
                    ['Jun', 1200, 330, 105, 145, 230],
                ],
            },
            'Weather Data': {
                caption: 'Weather Data',
                headers: ['Month', 'Avg Temp (°C)'],
                rows: [
                    ['Jan', 5],
                    ['Feb', 7],
                    ['Mar', 12],
                    ['Apr', 18],
                    ['May', 22],
                    ['Jun', 27],
                ],
            },
            'Quiz Scores': {
                caption: 'Quiz Scores',
                headers: ['Test', 'Math', 'Science', 'History', 'English'],
                rows: [
                    ['Test 1', 80, 85, 78, 90],
                    ['Test 2', 82, 80, 75, 88],
                    ['Test 3', 78, 89, 82, 84],
                    ['Test 4', 90, 92, 85, 87],
                    ['Test 5', 85, 88, 80, 90],
                ],
            }
        }
    }
});