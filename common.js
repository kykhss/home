
        function calculateAge(date) {
            const curruntyearear = 2025;
            const ageDate = curruntyearear + "-06-01";
            const dobInput = date;
            if (!dobInput) {
               // document.getElementById('ageResult').textContent = "Please enter a valid date of birth.";
                return "Please enter a valid date of birth.";
            }

            const dob = new Date(dobInput);
            const referenceDate = new Date(ageDate);
            // Check if the entered date is in the future
            if (dob > referenceDate) {
                document.getElementById('ageResult').textContent = "Invalid date of birth. Please enter a date in the past.";
                return "Invalid date of birth. Please enter a date in the past.";
            }
           // document.getElementById('referenceDate').textContent = dobInput;
            
            let years = referenceDate.getFullYear() - dob.getFullYear();
            let months = referenceDate.getMonth() - dob.getMonth();

            // Adjust years and months if birth month is after June
            if (months < 0) {
                years -= 1;
                months += 12;
            }

            // Format the output with pluralization
            const yearText = years + (years === 1 ? " YEAR" : " YEARS");
            const monthText = months + (months === 1 ? " MONTH" : " MONTHS");
           // document.getElementById('ageResult').textContent = `${yearText} & ${monthText}`;
            return `${yearText} & ${monthText}`;
        }
        function convertDateToText(dateString) {
            if (!dateString) {
                document.getElementById('dateText').textContent = "Please select a valid date.";
                return;
            }
    
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1; // Months are 0-indexed
            const year = date.getFullYear();
    
            const dayNames = [
                "Invalid Day", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth",
                "Eleventh", "Twelth", "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth", "Nineteenth", 
                "Twentieth", "Twenty-First", "Twenty-Second", "Twenty-Third", "Twenty-Fourth", "Twenty-Fifth", "Twenty-Sixth", 
                "Twenty-Seventh", "Twenty-Eighth", "Twenty-Ninth", "Thirtieth", "Thirty-First"
            ];
    
            const monthNames = [
                "Invalid Month", "January", "February", "March", "April", "May", "June", "July", "August", 
                "September", "October", "November", "December"
            ];
    
            const centuryPrefixes = {
                "19": "Nineteen",
                "20": "Two Thousand"
            };
    
            const yearSuffixes = {
                "01": "One", "02": "Two", "03": "Three", "04": "Four", "05": "Five", "06": "Six", "07": "Seven", "08": "Eight",
                "09": "Nine", "10": "Ten", "11": "Eleven", "12": "Twelve", "13": "Thirteen", "14": "Fourteen", "15": "Fifteen", 
                "16": "Sixteen", "17": "Seventeen", "18": "Eighteen", "19": "Nineteen", "20": "Twenty", "21": "Twenty-One", 
                "22": "Twenty-Two", "23": "Twenty-Three", "24": "Twenty-Four", "25": "Twenty-Five", "90": "Ninety",
                "91": "Ninety-One", "92": "Ninety-Two", "93": "Ninety-Three", "94": "Ninety-Four", "95": "Ninety-Five",
                "96": "Ninety-Six", "97": "Ninety-Seven", "98": "Ninety-Eight", "99": "Ninety-Nine"
            };
    
            // Day as text
            const dayText = day >= 1 && day <= 31 ? dayNames[day] : "Invalid Day";
    
            // Month as text
            const monthText = month >= 1 && month <= 12 ? monthNames[month] : "Invalid Month";
    
            // Year as text
            const yearStr = year.toString();
            const centuryPrefix = centuryPrefixes[yearStr.slice(0, 2)] || "Invalid Century";
            const yearSuffix = yearSuffixes[yearStr.slice(2)] || "Invalid Year";
    
            // Combined date text
            const dateText = `${dayText} ${monthText} ${centuryPrefix} ${yearSuffix}`;
            //document.getElementById('dateText').textContent = dateText;
            return dateText;
        }
        
// Utility function to format date to "DD/MM/YYYY"
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options); // Format as "DD/MM/YYYY"
}
function formatDateForInput(isoDate) {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function loadStudentPhotos(studentId, divid) {
    try {
        // Check if the photo exists in localStorage
        const savedPhoto = localStorage.getItem(`studentPhotos_${studentId}`);
        
        if (savedPhoto) {
            // If photo exists in localStorage, use it directly
            document.getElementById('student-photo-container').style.display = 'block';
            document.getElementById(divid).src = savedPhoto; // Set the photo from localStorage
            console.log('Photo loaded from localStorage');
        } else {
            // If no photo in localStorage, fetch it from the server
            const response = await fetch(`https://script.google.com/macros/s/AKfycbyFVRUjvnf3dj5uh0m6BCAiPCWHdmyxV9HvTjEfTB29LWAy7kC5vk96qPDFqwz1JlOK/exec?action=getStudentPhoto&studentId=${studentId}`);
            const data = await response.json();

            if (data.photo) {
                // If the photo is found on the server, save it to localStorage
                const photoUrl = `data:image/jpeg;base64,${data.photo}`;
                localStorage.setItem(`studentPhotos_${studentId}`, photoUrl); // Save to localStorage
                document.getElementById('student-photo-container').style.display = 'block';
                document.getElementById(divid).src = photoUrl; // Set the photo from server
                console.log('Photo loaded from server and saved to localStorage');
            } else if(data.photo===""){
                const demophoto = localStorage.getItem(`studentPhotos_KYHSS`);
                document.getElementById(divid).src = demophoto; // Set the photo from localStorage
           
            }
            else if (data.error) {
                document.getElementById('error-message').textContent = data.error; // Show error message
            }
        }
    } catch (error) {
        console.error('Error fetching photo:', error);
        document.getElementById('error-message').textContent = 'Failed to fetch photo.';
    }
}