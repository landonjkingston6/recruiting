  // Replace with your Google Sheet's export CSV URL
        // Get the spreadsheet ID from the edit URL (e.g., https://docs.google.com/spreadsheets/d/YOUR_ID/edit)
        // Then use: https://docs.google.com/spreadsheets/d/YOUR_ID/export?format=csv&gid=0
        const sheetUrl = 'https://docs.google.com/spreadsheets/d/1RwtkcGSaMuyU9qNgUYW9XqnUH7NShWy5NsekvXO2WHQ/export?format=csv&gid=0';

        fetch(sheetUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                console.log('Fetched data:', data); // Debug: log the raw data
                Papa.parse(data, {
                    complete: function(results) {
                        const rows = results.data.slice(1); // Skip header row
                        const playersDiv = document.getElementById('players');
                        rows.forEach(row => {
                            if (row.length >= 1 && row[0] && row[0].trim()) { // At least name
                                const L_Name = row[0] || 'Unknown';
                                const F_Name = row[1] || '';
                                const position = row[2] || '';
                                const offers = row[3] ? `<p>Offers: ${row[3]}</p>` : '';
                                const stats = row[4] || '';
                                const highlights = row[5] ? `<p>Highlights: ${row[5]}</p>` : '';
                                const bio = row[6] ? `<p>${row[6]}</p>` : '';

                                const card = document.createElement('div');
                                card.className = 'player-card';
                                card.innerHTML = `
                                    <h3>${L_Name}</h3>
                                    <h5>${F_Name}</h5>
                                    <p>Position: ${position}</p>
                                    ${offers}
                                    <p>Stats: ${stats}</p>
                                    ${highlights}
                                    ${bio}
                                `;
                                playersDiv.appendChild(card);
                            }
                        });
                    },
                    error: function(error) {
                        console.error('Error parsing CSV:', error);
                    }
                });
            })
            .catch(error => console.error('Error fetching sheet:', error));