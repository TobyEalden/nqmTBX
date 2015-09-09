# This .sh file will be sourced before starting your application.
# You can use it to put environment variables you want accessible
# to the server side of your app by using process.env.MY_VAR
#
# Example:
# export MONGO_URL="mongodb://localhost:27017/myapp-development"
# export ROOT_URL="http://localhost:3000"

#export MONGO_URL=mongodb://apiRW:ub1ub1@dev.nqminds.com:27017/nqmHub
export MONGO_URL=mongodb://dev-mint64:27017/nqmRead
#export MONGO_OPLOG_URL=mongodb://oplogger:pwd@dev-mint64:27017/local?authSource=admin
export ROOT_URL=http://localhost:3000
export MAIL_URL="smtp://nqminds@gmail.com:nqmindsSecure@smtp.gmail.com:465/"
