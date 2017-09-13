// Copyright 2016-2017, Pulumi Corporation.  All rights reserved.

import * as pulumi from "@pulumi/pulumi";

// Digest takes an Observable and produces another Observable
// which batches the input into groups delimted by times
// when `collect` is called on the Digest.
export class Digest<T> implements pulumi.Stream<T[]> {
    private table: pulumi.Table;
    private topic: pulumi.Topic<T[]>;
    public collect: () => Promise<void>;
    constructor(name: string, stream: pulumi.Stream<T>) {
        this.topic = new pulumi.Topic<T[]>(name);
        this.table = new pulumi.Table(name);
        stream.subscribe(name, async (item) => {
            console.log(`adding item to digest table`);
            await this.table.insert({ id: JSON.stringify(item) });
        });
        this.collect = async () => {
            console.log(`collecting digest`);
            let items = await this.table.scan();
            let ret: T[] = [];
            for (let i = 0; i < (<any>items).length; i++) {
                let item = items[i];
                (<any>ret).push(JSON.parse(item.id));
                console.log(`added item to digest ${item.id}`);
                await this.table.delete({ id: item.id });
                console.log(`deleted item from table ${item.id}`);
            }
            await this.topic.publish(ret);
            console.log(`published digest with ${(<any>ret).length} items`);
        };
    }
    subscribe(name: string, handler: (item: T[]) => Promise<void>) {
        this.topic.subscribe(name, handler);
    }
}
