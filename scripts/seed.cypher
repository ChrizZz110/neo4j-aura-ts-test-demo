// Constraints / indexes
CREATE CONSTRAINT user_id IF NOT EXISTS
FOR (u:User)
REQUIRE u.id IS UNIQUE;

// Optional sample data
MERGE (u1:User {id: "seed-1"}) SET u1.name = "Grace Hopper";
MERGE (u2:User {id: "seed-2"}) SET u2.name = "Alan Turing";