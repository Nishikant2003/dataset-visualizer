// Model for a Monthly Expenses, Weather Data, and Quiz Scores dataset
const DatasetModel = Backbone.Model.extend({
    defaults: {
        currentDataset: 'Monthly Expenses',
        datasets: {
            'Monthly Expenses': {
                
                caption: 'Monthly Expenses',
                headers: ['Month', 'Rent', 'Food', 'Transport', 'Utilities', 'Entertainment'],
                rows: [
                    ['January', 1200, 300, 100, 150, 200],
                    ['February', 1200, 310, 90, 140, 180],
                    ['March', 1000, 320, 110, 160, 190],
                    ['April', 1200, 315, 120, 150, 220],
                    ['May', 1200, 325, 100, 155, 210],
                    ['June', 1200, 330, 105, 145, 230],
                ],
                desc:"This table represents the monthly expenses of a household, including rent, food, transport, utilities, and entertainment costs. You can use tab to navigate through the table rows."
            },
            'Weather Data': {
                caption: 'Weather Data',
                headers: ['Month', 'Avg Temp (°C)'],
                rows: [
                    ['January', 5],
                    ['February', 7],
                    ['March', 12],
                    ['April', 18],
                    ['May', 22],
                    ['June', 27],
                ],
                desc:"This table represents the average monthly temperatures in degrees Celsius for a specific location, showing the seasonal changes in weather.  You can use tab to navigate through the table rows."
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
                desc:"This table contains scores from various quizzes in subjects like Math, Science, History, and English, providing insights into student performance across different subjects.  You can use tab to navigate through the table rows."
            }
        }
    }
});