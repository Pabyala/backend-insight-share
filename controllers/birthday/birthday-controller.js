const Follower = require('../../model/follower-model');

const getBirthdayToday = async (req, res) => {
    const userIdFormAuth = req.user.id;
    
    const today = new Date();
    const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const todayDay = today.getDate().toString().padStart(2, '0');
    
    try {
        // find the followers followed by the authenticated user
        const followers = await Follower.find({ follower: userIdFormAuth }).populate({
            path: 'following',
            match: {
                // check if the month and today is match of dateOfBirth of user
                dateOfBirth: new RegExp(`-${todayMonth}-${todayDay}$`), 
                // isDateBirthShow: true 
            },
            select: '_id username firstName middleName lastName dateOfBirth avatarUrl coverPhotoUrl'
        });

        const followersWithBirthdayToday = followers
            .map(follow => follow.following)
            .filter(user => user);

        res.json({ 
            message: "Today's birthday",
            countBirthday: followersWithBirthdayToday.length,
            birthdaysToday: followersWithBirthdayToday 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBirthdayToday };
