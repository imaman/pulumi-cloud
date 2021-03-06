// Copyright 2016-2018, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as cloud from "@pulumi/cloud";
import { Output } from "@pulumi/pulumi";

const api = new cloud.API("examples-test");
api.get("/test1.txt", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.end("You got test1");
});
api.proxy("/google", "http://www.google.com/")

export let url = api.publish().url;
