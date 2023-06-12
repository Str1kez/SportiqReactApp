# React App for Sportiq project

This is browser app on React JS for interaction with API of Sportiq project. It is my debut in frontend 😄

## Related Sportiq services

- [API Gateway](https://github.com/Str1kez/SportiqAPIGateway)
- [User Service](https://github.com/Str1kez/SportiqUserService)
- [Event Service](https://github.com/Str1kez/SportiqEventService)
- [Subscription Service](https://github.com/Str1kez/SportiqSubscriptionService)

## Examples

### Main page

![main page](/screenshots/Pasted%20image%2020230517155417.png)

After authentication you'll pass on main page with map of existing events. On hover you can see short info about event. Clicking on the marker will take you to a page with full info. You can use filter for choosing your favorite type of sport or even status of event. Double clicking on the map will redirect you on page of creation.

### Event creation

![event creation](/screenshots/Pasted%20image%2020230517155643.png)

This is simple form with validation. If the event was created successfully, you'll see it on the map.

### Created event on the map

![created event](/screenshots/Pasted%20image%2020230517155758.png)

If you are the creator of the event, you can change it or even delete. But this behavior is managed by the API, more precisely by the event microservice.

### Managing event info

![event info](/screenshots/Pasted%20image%2020230517160342.png)
If you are an event guest, then you can subscribe on it.

### Event subscription

![subscribe on event](/screenshots/Pasted%20image%2020230517160713.png)

Tracked events will be in the list of subscriptions. If the event is ended or deletes, it will be added to the history list.

### History and subscriptions

![subscriptions](/screenshots/Pasted%20image%2020230517160851.png)
![history](/screenshots/Pasted%20image%2020230517161743.png)

## TODO

- [ ] Add Redux for global states
- [ ] Improve optimization

## Startup

```commandline
npm i
npm start
```
