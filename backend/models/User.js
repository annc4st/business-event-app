const { DataTypes } = require ('sequelize')
const {sequelize } = require ('../db/database-seq')
const isEmail = require('validator/lib/isEmail');


const User = sequelize.define('User', {

  username: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique:{
            msg: 'Username already exists',
        }
    },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email already exists',
    },
    validate: {
      isEmail: {
        args: true,
        msg: 'Invalid email format',
      },
    },
  },

  hashed_password : { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
              args: [6],
              msg: 'Minimum password length is 6 characters',
            },
          },
        
    },
},
{
  tableName: 'users',         // Explicitly specify the table name
  freezeTableName: true,      // Disable automatic pluralization
  timestamps: false // Disable timestamps
})


module.exports = User;