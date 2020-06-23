<div class="col-xl-6 mb-4">
    <div class="card mb-4 shadow h-100 py-2 text-dark">
	<div class="card-header">
	    <i class="fas fa-network-wired mr-1"></i>Server informations
	</div>
        <div class="card-body">
            <div id="myServerInfo" width="100%" height="187">
                <div class="col-xl-12 col-md-6">
                    <div class="card bg-light text-black mb-4">
                        <div class="card-body">
                            Interface: $INT$<br />Public key: $PKEY$=<br />Listening port: $PORT$<br />
                            <table>
                                <tr><td>RX: bytes</td><td>Packets</td><td>Errors</td><td>Dropped</td><td>Overrun</td><td>Mcast</td></tr>
                                <tr><td>$rxb$</td><td>$rxp$</td><td>$rxe$</td><td>$rxd$</td><td>$rxo$</td><td>$rxm$</td></tr>
                                <tr><td>TX: bytes</td><td>Packets</td><td>Errors</td><td>Dropped</td><td>Overrun</td><td>Mcast</td></tr>
                                <tr><td>$txb$</td><td>$txp$</td><td>$txe$</td><td>$txd$</td><td>$txo$</td><td>$txm$</td></tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="col-xl-6 mb-4">
    <div class="card mb-4 shadow h-100 py-2 text-dark">
        <div class="card-header"><i class="fas fa-chart-area mr-1"></i>RX TX Chart for $INT$</div>
        <div class="card-body"><canvas id="myAreaChart" width="100%" height="55"></canvas></div>
    </div>
</div>

