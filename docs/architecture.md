# QuickNotes System Architecture

## 1. Functional Requirements

The QuickNotes system should:

1. Allow users to create notes.
2. Allow users to view a list of notes.
3. Allow users to delete notes.
4. Allow users to search and retrieve notes through the API.
5. Store users, notes, tags, and note-tag relationships in a database.
6. Provide REST API endpoints for client applications.
7. Process background tasks using a queue and worker.

## 2. Non-Functional Requirements

The system should:

1. Be available and reliable even when one application server fails.
2. Support approximately 1 million registered users.
3. Provide fast response times for common read operations.
4. Protect user data through authentication, authorization, and encrypted connections.
5. Scale horizontally by adding more application servers.
6. Maintain database backups and provide recovery from failures.
7. Support monitoring, logging, and error tracking.

## 3. Capacity Estimates for 1 Million Users

### Assumptions

- 1,000,000 registered users.
- 20% of users are active each day = 200,000 daily active users.
- Each active user performs about 10 read operations per day.
- Each active user performs about 2 write operations per day.
- Peak traffic is estimated at 5 times the daily average.
- Average stored note data, including metadata and indexes, is approximately 2 KB per note.

### Read Traffic

200,000 users × 10 reads/day = 2,000,000 reads/day.

Average reads per second:

2,000,000 ÷ 86,400 ≈ 23 reads/second.

Estimated peak:

23 × 5 ≈ **115 reads/second**.

### Write Traffic

200,000 users × 2 writes/day = 400,000 writes/day.

Average writes per second:

400,000 ÷ 86,400 ≈ 4.6 writes/second.

Estimated peak:

4.6 × 5 ≈ **23 writes/second**.

### Storage

400,000 new notes/day × 365 days = 146,000,000 notes/year.

At approximately 2 KB per note:

146,000,000 × 2 KB ≈ **292 GB of logical storage per year**.

Therefore, approximately **300 GB of new note data per year** should be planned for, excluding additional backups and larger future requirements.

## 4. High-Level Architecture

```text
                         +----------------+
                         |     Client     |
                         | Browser / App  |
                         +-------+--------+
                                 |
                                 v
                         +----------------+
                         |      DNS       |
                         +-------+--------+
                                 |
                                 v
                         +----------------+
                         |      CDN       |
                         +-------+--------+
                                 |
                                 v
                    +------------+------------+
                    |      Load Balancer      |
                    +------------+------------+
                                 |
                    +------------+------------+
                    |                         |
                    v                         v
             +-------------+           +-------------+
             | App Server 1|           | App Server 2|
             +------+------+           +------+------+
                    |                         |
                    +------------+------------+
                                 |
                         +-------+-------+
                         |     Cache     |
                         +-------+-------+
                                 |
                    +------------+------------+
                    |                         |
                    v                         v
             +-------------+           +-------------+
             | Primary DB  | --------> | Read Replica|
             +------+------+           +-------------+
                    |
                    v
             +-------------+
             |    Queue    |
             +------+------+
                    |
                    v
             +-------------+
             |   Worker    |
             +-------------+
```

## 5. Component Purposes

| Component        | Purpose                                                                             |
| ---------------- | ----------------------------------------------------------------------------------- |
| Client           | Provides the user interface for creating, viewing, and deleting notes.              |
| DNS              | Converts the QuickNotes domain name into the correct service address.               |
| CDN              | Delivers static files such as HTML, CSS, and JavaScript closer to users.            |
| Load Balancer    | Distributes incoming requests across multiple application servers.                  |
| App Server 1     | Handles API requests and application business logic.                                |
| App Server 2     | Provides another application instance for scaling and high availability.            |
| Cache            | Stores frequently requested data to reduce database load and improve response time. |
| Primary Database | Handles authoritative writes and stores the main application data.                  |
| Read Replica     | Handles read queries and reduces load on the primary database.                      |
| Queue            | Stores background jobs so they can be processed asynchronously.                     |
| Worker           | Processes background jobs from the queue.                                           |

## 6. GET `/notes` Request Flow

1. The client sends a `GET /notes` request.
2. DNS directs the request to the QuickNotes infrastructure.
3. The CDN serves cached static resources when appropriate.
4. The load balancer sends the API request to an available application server.
5. The application server checks the cache for the requested notes.
6. If the notes are in the cache, they are returned immediately.
7. If there is a cache miss, the application server reads the notes from the read replica.
8. The result is stored in the cache for future requests.
9. The application server returns the notes to the client.

This flow reduces database load and provides faster responses for frequently accessed notes.

## 7. POST `/notes` Request Flow

1. The client sends a `POST /notes` request containing the note data.
2. The load balancer sends the request to an available application server.
3. The application server validates the request and checks authentication and authorization.
4. The application server writes the new note to the primary database.
5. The primary database replicates the data to the read replica.
6. The application server publishes any required background task to the queue.
7. A worker retrieves the task and performs background processing such as notifications, analytics, or indexing.
8. The application server returns a `201 Created` response to the client.

The primary database is used for writes because it is the authoritative source of application data.

## 8. Important Architecture Trade-Offs

### Database Read Replica

Using a read replica improves read performance and reduces pressure on the primary database.

**Trade-off:** Replication may introduce a small delay, so a newly created note may not immediately appear on a read replica.

### Caching

Caching improves response time and reduces database queries.

**Trade-off:** Cached data can become stale, and cache invalidation adds complexity.

### Queue and Worker

A queue allows slow background tasks to run separately from user requests.

**Trade-off:** Background processing becomes eventually consistent, and the system must handle failed or delayed jobs.

### Horizontal Scaling

Using multiple application servers allows the system to handle more traffic.

**Trade-off:** The application should remain stateless or store shared state outside individual servers.

## 9. Avoiding Single Points of Failure

The architecture avoids major single points of failure by:

1. Using at least two application servers so one server can fail without stopping the application.
2. Using a redundant/load-balanced infrastructure rather than relying on one application server.
3. Using a highly available primary database with automatic failover.
4. Maintaining a read replica for additional database availability and read capacity.
5. Deploying cache and queue services in highly available configurations.
6. Keeping the cache as a performance layer rather than the source of truth, so a cache failure does not destroy application data.
7. Using database backups to recover from serious database failures.

## 10. Scalability Summary

The QuickNotes architecture can scale by adding more application servers behind the load balancer. Read traffic can be increased by adding additional read replicas and improving cache usage. Database storage can be expanded as the number of users and notes increases. Background processing can scale by adding more workers to consume jobs from the queue.

This architecture separates user-facing requests, data storage, caching, and background processing so that each part can scale independently as QuickNotes grows.
