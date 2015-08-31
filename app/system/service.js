/**
 * Created by toby on 25/06/15.
 */

if (Meteor.isServer) {
  ServiceConfiguration.configurations.upsert(
    { service: "google" },
    {
      $set: {
        clientId: "1051724674890-6qk768hmaatgl2810lc4n9qbns08emqh.apps.googleusercontent.com",
        loginStyle: "popup",
        secret: "jP9mX2UsxqW8Dy1yVCWwSZHO"
      }
    }
  );
}
