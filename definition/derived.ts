export class File {
    
}

export class Score {
    public convertToString() {
        return ""
    }

    public static fromString(content: string) {
        return new Score()
    }
}