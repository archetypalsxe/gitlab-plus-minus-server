import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {TokenStorage} from './token.storage';
import { TokenInterceptor } from './token.interceptor';

// Import rxjs map operator
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})

export class AppComponent implements OnInit {
  title = 'app works!';

  // Link to our api, pointing to localhost
  API = 'http://' + location.hostname + ':3000';

  webToken = undefined;


  // Declare empty list of people
  people: Object = [];
  activities: Object = [];
  weights: Object = [];

  constructor(public tokenStorage: TokenStorage, private http: HttpClient) {}

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.getAllPeople();
    this.getAllActivities();
    this.getAllWeights();
  }

  // Get the weights for a user
  getWeightsForUser(userId) {
    this.http.get(`${this.API}/weights/user/${userId}`)
        .map(res => res)
        .subscribe(weights => {
            console.log(weights);
        })
  }

  loginUser(email, password) {
    this.http.post(`${this.API}/authenticate`, {email, password})
      .map(res => res)
      .subscribe((response) => {
        console.log(response);
        if(response.token === undefined) {
          this.tokenStorage.removeToken();
          alert("Invalid email or password entered");
        } else {
          this.webToken = response.token;
          this.tokenStorage.setToken(response.token);
          alert("Logged in!");
        }
      })
  }

  getToken() {
    return this.webToken;
  }

  // Add one person to the API
  addPerson(email, firstName, lastName, password) {
    this.http.post(`${this.API}/users`, {email, firstName, lastName, password})
      .map(res => res)
      .subscribe(() => {
        this.getAllPeople();
      })
  }

    // Add an activity to the API
    addActivity(userId, dateTime, description, weightValue) {
        this.http.post(`${this.API}/activities`, {userId, dateTime, description, weightValue})
            .map(res => res)
            .subscribe(() => {
                this.getAllActivities();
        })
    }

    addWeight(userId, dateTime, weight) {
        this.http.post(`${this.API}/weights`, {userId, dateTime, weight})
            .map(res => res)
            .subscribe(() => {
                this.getAllWeights();
            })
    }

    // Delete the provided field based on the provided ID
    deleteField(fieldName, fieldId) {
        this.http.post(`${this.API}/settings`, {"action": "delete", fieldName, fieldId})
            .map(res => res)
            .subscribe(() => {
                this.getAllWeights();
                this.getAllActivities();
                this.getAllPeople();
            })
    }

  // Get all users from the API
  getAllPeople() {
    this.http.get(`${this.API}/users`)
      .map(res => res)
      .subscribe(people => {
        console.log(people)
        this.people = people
      })
  }

  // Get all activities from the API
    getAllActivities() {
        this.http.get(`${this.API}/activities`)
            .map(res => res)
            .subscribe(activities => {
                console.log(activities)
                this.activities = activities
        })
    }

    //Get all activities for a user
    getActivitiesForUser(userId) {
        this.http.get(`${this.API}/activities/user/${userId}`)
            .map(res => res)
            .subscribe(activities => {
                console.log(activities);
            })
    }

    getAllWeights() {
        this.http.get(`${this.API}/weights`)
            .map(res => res)
            .subscribe(weights => {
                console.log(weights)
                this.weights = weights
        })
    }
}
