const msgBeginning = ['Straighten up, ', 'How\'s your posture, ', 'Check your posture, ', 'Sit up straight, ', 'Check yourself, ', 'At attention, ',
    'Mommy said no slouching, ', 'Posture police, ', 'Stop slouching, ', 'Dump the slump, ', 'Posture check, ',
    'Improve your posture, ', 'No bent spines, ', 'Mind your posture, ', 'Your posture looking sus, ']
const msgEnd = ['bro.', 'sir.', 'boss.', 'partner.', 'soldier', 'chump.', 'mate.', 'friend.', 'comrade.', 'cuz.', 'homie.']

/**
 * Creates a random notification message
 * 
 * @returns Notification Message
 */
export const generateMessage = (): string => {
    const begInt = Math.floor(Math.random() * msgBeginning.length)
    const endInt = Math.floor(Math.random() * msgEnd.length)

    const fullMsg = msgBeginning[begInt] + msgEnd[endInt] + " 🫡 \n\n\Is your posture straight?"

    return fullMsg
}
