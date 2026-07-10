export type Choice = {
  text: string
  icon: string
  isCorrect: boolean
  feedback: {
    title: string
    message: string
    tip: string
  }
}

export type Scenario = {
  id: string
  icon: string
  title: string
  description: string
  choices: Choice[]
}

export type GameFormData = {
  title: string
  description: string
  slug: string
  icon: string
  status: string
  organizationId: string
}
