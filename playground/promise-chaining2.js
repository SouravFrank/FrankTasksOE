require('../src/db/mongoose')
const Tasks = require('../src/models/task')

const deleteTaskAndCount = async (id) => {
    const task = await Tasks.findByIdAndDelete(id)
    const count = await Tasks.countDocuments({ completed: false })
    console.log(task);
    return count
}

deleteTaskAndCount('5e5578a2372bd83a54b17ab6').then((count) => {
    console.log("count remaing : " + count);
    
}).catch((e) => {
    console.error(e);
    
})