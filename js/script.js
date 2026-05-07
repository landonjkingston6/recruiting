
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
                        
                        // Extract unique grad years and sort them
                        const gradYears = [...new Set(rows.map(row => row[8]).filter(year => year && year.trim()))].sort();
                        
                        // Create filter dropdown
                        const filterContainer = document.createElement('div');
                        filterContainer.style.cssText = 'text-align: center; margin-bottom: 2rem;';
                        
                        const label = document.createElement('label');
                        label.textContent = 'Filter by Grad Year: ';
                        label.style.cssText = 'margin-right: 0.5rem; font-weight: bold;';
                        
                        const select = document.createElement('select');
                        select.id = 'gradYearFilter';
                        select.style.cssText = 'padding: 0.5rem; font-size: 1rem; cursor: pointer;';
                        
                        const allOption = document.createElement('option');
                        allOption.value = 'all';
                        allOption.textContent = 'Show All';
                        select.appendChild(allOption);
                        
                        gradYears.forEach(year => {
                            const option = document.createElement('option');
                            option.value = year;
                            option.textContent = `Class of ${year}`;
                            select.appendChild(option);
                        });
                        
                        filterContainer.appendChild(label);
                        filterContainer.appendChild(select);
                        playersDiv.parentNode.insertBefore(filterContainer, playersDiv);
                        
                        // Store card references for filtering
                        const cardMap = new Map();
                        rows.forEach(row => {
                            if (row.length >= 1 && row[0] && row[0].trim()) { // At least name
                                const L_Name = row[0] || 'Unknown';
                                const F_Name = row[1] || '';
                                const position = row[2] || '';
                                const offers = row[3] || '';
                                const hudl = row[4] || '';
                                const imageURL = row[5] || '';
                                const height = row[6] || '';
                                const number = row[7] || '';
                                const gradYear = row[8] || '';
                                const weight = row[9] || '';
                                const bench = row[10] || '';
                                const squat = row[11] || '';
                                const clean = row[12] || '';
                                const fourty = row[13] || '';
                                const hundred = row[14] || '';
                                const shuttle = row[15] || '';
                                const broadJ = row[16] || '';
                                const vertJ = row[17] || '';
                                const act = row[18] || '';
                                const gpa = row[19] || '';
                                const coachEmail = row[20] || '';

                                const card = document.createElement('div');
                                card.className = 'player-card';
                                card.innerHTML = `
                                    <div class="player-card-face front">
                                        <div class="cardOverlay"></div>
                                        <h5 class="number">${number}</h5>
                                        <div class="player-card-grid">
                                            <h3 class="lName">${L_Name}</h3>
                                            <h5 class=fName>${F_Name}</h5>
                                            <h5 class="gradYear">Class of ${gradYear}</h5>
                                            <p class="position">Position:<span class="textAdjust"> ${position}</span></p>
                                            <img class="playerBioImage" src="/images/playerImages/${imageURL}">
                                            <p class="offers">Offers:<span class="textAdjust"> ${offers}</span></p>
                                            <a href="${hudl}" class="hudl" target="_blank">View Hudl</a>
                                            <p class="height">Height:<span class="textAdjust"> ${height}</span></p>
                                            <button type="button" class="playerButton viewProfileButton">View Profile</button>
                                        </div>
                                    </div>
                                    <div class="player-card-face back">
                                        <div class="back-content">
                                            <h3 class="fullName">${F_Name} ${L_Name}</h3>
                                            <p class="back-item height">Height:<span>${height}</span></p>
                                            <p class="back-item weight">Weight:<span>${weight}</span></p>
                                            <p class="back-item position">Position:<span>${position}</span></p>
                                            <p class="back-item bench">Bench: ${bench}</p>
                                            <p class="back-item squat">Squat: ${squat}</p>
                                            <p class="back-item clean">Clean: ${clean}</p>
                                            <p class="back-item fourty">40 Yard Dash: ${fourty}</p>
                                            <p class="back-item hundred">100 meter: ${hundred}</p>
                                            <p class="back-item shuttle">Shuttle: ${shuttle}</p>
                                            <p class="back-item broadJ">Broad Jump: ${broadJ}</p>
                                            <p class="back-item vertJ">Vertical Jump: ${vertJ}</p>
                                            <p class="back-item act">ACT: ${act}</p>
                                            <p class="back-item gpa">GPA: ${gpa}</p>
                                            <p class="back-item coachEmail">Coach Contact: ${coachEmail}</p>
                                            <button type="button" class="playerButton backButton">Back</button>
                                        </div>
                                    </div>
                                `;
                                playersDiv.appendChild(card);                                
                                // Store card with its grad year for filtering
                                cardMap.set(card, gradYear);
                                const viewProfileButton = card.querySelector('.viewProfileButton');
                                const backButton = card.querySelector('.backButton');

                                viewProfileButton.addEventListener('click', () => {
                                    card.classList.add('flipped');
                                });

                                backButton.addEventListener('click', () => {
                                    card.classList.remove('flipped');
                                });
                            }
                        });
                        
                        // Add filter event listener
                        const filterSelect = document.getElementById('gradYearFilter');
                        filterSelect.addEventListener('change', (e) => {
                            const selectedYear = e.target.value;
                            cardMap.forEach((year, card) => {
                                if (selectedYear === 'all' || year === selectedYear) {
                                    card.style.display = '';
                                } else {
                                    card.style.display = 'none';
                                }
                            });
                        });
                    },
                    error: function(error) {
                        console.error('Error parsing CSV:', error);
                    }
                });
            })
            .catch(error => console.error('Error fetching sheet:', error));