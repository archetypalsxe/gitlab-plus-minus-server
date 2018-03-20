import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

// Import rxjs map operator
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  // Link to our api, pointing to localhost
  API = 'http://' + location.hostname + ':3000';

  webToken = undefined;


  // Declare empty list of people
  people: any[] = [];
  activities: any[] = [];
  weights: any[] = [];

  constructor(private http: Http) {}

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.getAllPeople();
    this.getAllActivities();
    this.getAllWeights();
  }

  // Get the weights for a user
  getWeightsForUser(userId) {
    this.http.get(`${this.API}/weights/user/${userId}`)
        .map(res => res.json())
        .subscribe(weights => {
            console.log(weights);
        })
  }

  loginUser(email, password) {
    this.http.post(`${this.API}/authenticate`, {email, password})
      .map(res => res.json())
      .subscribe((response) => {
        if(response.token === undefined) {
          alert("Invalid email or password entered");
        } else {
          this.webToken = response.token;
          alert("Logged in!");
        }
      })
  }

  // Add one person to the API
  addPerson(email, firstName, lastName, password) {
    this.http.post(`${this.API}/users`, {email, firstName, lastName, password})
      .map(res => res.json())
      .subscribe(() => {
        this.getAllPeople();
      })
  }

    // Add an activity to the API
    addActivity(userId, dateTime, description, weightValue) {
        this.http.post(`${this.API}/activities`, {userId, dateTime, description, weightValue})
            .map(res => res.json())
            .subscribe(() => {
                this.getAllActivities();
        })
    }

    addWeight(userId, dateTime, weight) {
        this.http.post(`${this.API}/weights`, {userId, dateTime, weight})
            .map(res => res.json())
            .subscribe(() => {
                this.getAllWeights();
            })
    }

    // Delete the provided field based on the provided ID
    deleteField(fieldName, fieldId) {
        this.http.post(`${this.API}/settings`, {"action": "delete", fieldName, fieldId})
            .map(res => res.json())
            .subscribe(() => {
                this.getAllWeights();
                this.getAllActivities();
                this.getAllPeople();
            })
    }

  // Get all users from the API
  getAllPeople() {
    this.http.get(`${this.API}/users`)
      .map(res => res.json())
      .subscribe(people => {
        console.log(people)
        this.people = people
      })
  }

  // Get all activities from the API
    getAllActivities() {
        this.http.get(`${this.API}/activities`)
            .map(res => res.json())
            .subscribe(activities => {
                console.log(activities)
                this.activities = activities
        })
    }

    //Get all activities for a user
    getActivitiesForUser(userId) {
        this.http.get(`${this.API}/activities/user/${userId}`)
            .map(res => res.json())
            .subscribe(activities => {
                console.log(activities);
            })
    }

    getAllWeights() {
        this.http.get(`${this.API}/weights`)
            .map(res => res.json())
            .subscribe(weights => {
                console.log(weights)
                this.weights = weights
        })
    }
}
