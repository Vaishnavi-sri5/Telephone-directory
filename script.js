// Initialize an empty array to store contact data
const contacts = JSON.parse(localStorage.getItem('contacts')) || [];

// Add contact function
function addContact(name, phoneNumbers, address, emails) {
    const contact = {
        id: Date.now(),
        name: name.trim(),
        phoneNumbers: phoneNumbers.split(',').map(num => num.trim()),
        address: address.trim(),
        emails: emails.split(',').map(email => email.trim())
    };
    contacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Search contacts function
function searchContacts(query) {
    return contacts.filter(contact => {
        return contact.name.toLowerCase().includes(query.toLowerCase()) ||
               contact.phoneNumbers.some(num => num.includes(query)) ||
               contact.address.toLowerCase().includes(query.toLowerCase()) ||
               contact.emails.some(email => email.includes(query));
    });
}

// Delete contact function
function deleteContact(id) {
    const index = contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
        contacts.splice(index, 1);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        alert('Contact deleted successfully');
        loadContacts(); // Refresh the contact list
    } else {
        alert('Contact not found');
    }
}

// Edit contact function
function editContact(id) {
    const contact = contacts.find(contact => contact.id === id);
    if (!contact) {
        alert('Contact not found');
        return;
    }

    const editRow = document.createElement('tr');
    editRow.innerHTML = `
        <td colspan="5">
            <h3>Edit Contact</h3>
            <label>Select field to edit:</label>
            <div>
                <input type="radio" name="editField" value="name" checked> Name
                <input type="radio" name="editField" value="phoneNumbers"> Phone Numbers
                <input type="radio" name="editField" value="address"> Address
                <input type="radio" name="editField" value="emails"> Emails
            </div>
            <label for="newValue">Enter new value:</label>
            <input type="text" id="newValue">
            <br>
            <button onclick="saveEdit(${contact.id})">Save</button>
            <button onclick="cancelEdit()">Cancel</button>
        </td>
    `;
    
    // Insert the edit row right after the selected contact's row
    const contactRow = document.getElementById(`contact-${id}`);
    contactRow.parentNode.insertBefore(editRow, contactRow.nextSibling);
}

// Save edited contact
function saveEdit(id) {
    const contact = contacts.find(contact => contact.id === id);
    const fieldToEdit = document.querySelector('input[name="editField"]:checked').value;
    const newValue = document.getElementById('newValue').value.trim();

    if (fieldToEdit === 'name') {
        contact.name = newValue;
    } else if (fieldToEdit === 'phoneNumbers') {
        contact.phoneNumbers = newValue.split(',').map(num => num.trim());
    } else if (fieldToEdit === 'address') {
        contact.address = newValue;
    } else if (fieldToEdit === 'emails') {
        contact.emails = newValue.split(',').map(email => email.trim());
    }

    localStorage.setItem('contacts', JSON.stringify(contacts));
    alert('Contact updated successfully');
    loadContacts(); // Refresh the contact list
}

// Cancel editing
function cancelEdit() {
    const editRow = document.querySelector('tr > td[colspan="5"]');
    if (editRow) {
        editRow.parentNode.removeChild(editRow);
    }
}

// Load contacts function
function loadContacts() {
    const query = document.getElementById('searchInput').value;
    const results = searchContacts(query);

    const contactList = document.querySelector('#contactList tbody');
    contactList.innerHTML = '';

    results.forEach(contact => {
        const contactRow = document.createElement('tr');
        contactRow.id = `contact-${contact.id}`;
        contactRow.innerHTML = `
            <td>${contact.name}</td>
            <td>
                ${contact.phoneNumbers.map(num => `<a href="tel:${num}">${num}</a>`).join(', ')}
            </td>
            <td>${contact.address}</td>
            <td>${contact.emails.join(', ')}</td>
            <td>
                <button class="edit" onclick="editContact(${contact.id})">Edit</button>
                <button class="delete" onclick="deleteContact(${contact.id})">Delete</button>
            </td>
        `;
        contactList.appendChild(contactRow);
    });

    if (results.length === 0) {
        const noResultsRow = document.createElement('tr');
        noResultsRow.innerHTML = '<td colspan="5">No contacts found</td>';
        contactList.appendChild(noResultsRow);
    }
}

// Handle form submission on add.html
if (document.getElementById('addContactForm')) {
    document.getElementById('addContactForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const phoneNumbers = document.getElementById('phoneNumbers').value;
        const address = document.getElementById('address').value;
        const emails = document.getElementById('emails').value;

        addContact(name, phoneNumbers, address, emails);

        this.reset(); // Clear the form
        alert('Contact added successfully!');
    });
}

// Handle search button click on search.html
if (document.getElementById('searchButton')) {
    document.getElementById('searchButton').addEventListener('click', loadContacts);
}

// Load contacts when the page loads
if (document.getElementById('contactList')) {
    loadContacts();
}
