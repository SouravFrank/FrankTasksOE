require('../src/db/mongoose')
const User = require('../src/models/user')

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    console.log(user);
    return count
}

updateAgeAndCount('5e5564373dec7d3a5c8850db',15).then((count) => {
    console.log("count: " + count);
    
}).catch((e) => {
    console.error(e);
    
})