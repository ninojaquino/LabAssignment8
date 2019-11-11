import { Component, OnInit } from '@angular/core';
import { Contact } from './contacts.model';
import { Http } from '@angular/http';

@Component({
  selector: 'contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts: Array<Contact> = [];
  contactParams: string = '';
  constructor(private http: Http) { }

  async ngOnInit() {
    this.loadContacts();
  }

  async loadContacts() {
    // loading items from local storage and make it persistent
    const savedContacts = this.getItemsFromLocalStorage('contacts');
    if (savedContacts && savedContacts.length > 0) {
      this.contacts = savedContacts;
    } else {
      this.contacts = await this.loadItemsFromFile();
    }
    this.sortByID(this.contacts);
  }

  async loadItemsFromFile() {
    const data = await this.http.get('assets/contacts.json').toPromise();
    console.log('from loadItemsFromFile data: ', data.json());
    return data.json();
  }

  addContact() {
    this.contacts.unshift(new Contact({}));
    console.log('this.contacts...', this.contacts);
  }

  deleteContact(index: number) {
    console.log('from deleteContact index: ', index);
    this.contacts.splice(index, 1);
    // deleting items from local storage saved file
    this.saveItemsToLocalStorage(this.contacts);
  }

  saveContact(contact: any) {
    console.log('from saveContact', contact);
    contact.editing = false;
    this.saveItemsToLocalStorage(this.contacts);
  }

  saveItemsToLocalStorage(contacts: Array<Contact>) {
    contacts = this.sortByID(contacts);
    const savedContacts = localStorage.setItem('contacts', JSON.stringify(contacts));
    console.log('from saveItemToLocalStorage savedContacts: ', savedContacts);
    return savedContacts;
  }

  getItemsFromLocalStorage(key: string) {
    const savedContacts = JSON.parse(localStorage.getItem(key));
    console.log('from getItemsFromLocalStorage savedItems', savedContacts);
    return savedContacts;
  }

  searchContact(params: string) {
    // filtering the search results
    console.log('from searchContact params: ', params);
    this.contacts = this.contacts.filter((item: Contact) => {
      const fullName = item.firstName + ' ' + item.lastName;
      console.log('full name is --->', fullName);
      console.log('item--->', item.firstName);
      if (params === fullName || params === item.firstName || params === item.lastName) {
        return true;
      } else {
        return false;
      }

    });
  }

  sortByID(contacts: Array<Contact>) {
    contacts.sort((prevContact: Contact, presContact: Contact) => {
      return prevContact.id > presContact.id ? 1 : -1;
    });
    console.log('the sorted contacts', contacts);
    return contacts;
  }

}
